import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
import {utils, providers, Contract, Wallet} from 'ethers';
import {createKeyPair, getDeployedBytecode, KeyPair, calculateInitializeSignature, TEST_GAS_PRICE, TEST_GAS_PRICE_IN_TOKEN, ETHER_NATIVE_TOKEN, DEPLOY_GAS_LIMIT, TEST_APPLICATION_INFO, TEST_REFUND_PAYER, safeMultiply, TEST_TOKEN_PRICE_IN_ETH} from '@unilogin/commons';
import {signStringMessage, calculateGnosisStringHash, gnosisSafe} from '@unilogin/contracts';
import {startRelayer, getInitData} from '../testhelpers/http';
import {createFutureWalletAndPost} from '../testhelpers/createFutureWalletAndPost';
import {RelayerUnderTest} from '../../src';
import {waitForDeploymentStatus} from '../testhelpers/waitForDeploymentStatus';
import {deployGnosisSafeProxyWithENS} from '../testhelpers/createGnosisSafeContract';
chai.use(chaiHttp);

describe('E2E: Relayer - counterfactual deployment', () => {
  let relayer: RelayerUnderTest;
  let provider: providers.Provider;
  let deployer: Wallet;
  let walletContract: Contract;
  let factoryContract: Contract;
  let mockToken: Contract;
  let fallbackHandlerContract: Contract;
  let keyPair: KeyPair;
  let ensAddress: string;
  let contractAddress: string;
  const relayerPort = '33511';
  const relayerUrl = `http://localhost:${relayerPort}`;
  const ensName = 'myname.mylogin.eth';
  let signature: string;
  let ensRegistrar: Contract;

  beforeEach(async () => {
    ({provider, relayer, deployer, walletContract, factoryContract, mockToken, ensAddress, ensRegistrar, fallbackHandlerContract} = await startRelayer(relayerPort));
    keyPair = createKeyPair();
    ({signature, contractAddress} = await createFutureWalletAndPost(relayerUrl, keyPair, ensName, factoryContract, deployer, ensAddress, relayer.publicConfig.ensRegistrar, walletContract.address, fallbackHandlerContract.address));
  });

  it('Counterfactual deployment with ether payment and refund', async () => {
    await deployer.sendTransaction({to: contractAddress, value: utils.parseEther('0.5')});
    const initialRelayerBalance = await deployer.getBalance();
    const result = await chai.request(relayerUrl)
      .post('/wallet/deploy/')
      .send({
        publicKey: keyPair.publicKey,
        ensName,
        gasPrice: TEST_GAS_PRICE,
        gasToken: ETHER_NATIVE_TOKEN.address,
        signature,
        applicationInfo: TEST_APPLICATION_INFO,
        contractAddress,
      });
    expect(result.status).to.eq(201);
    const status = await waitForDeploymentStatus(relayerUrl, result.body.deploymentHash, 'Success');
    expect(status.transactionHash).to.be.properHex(64);
    expect(await provider.getCode(contractAddress)).to.eq(`0x${getDeployedBytecode(gnosisSafe.Proxy as any)}`);
    expect(await deployer.getBalance()).to.be.above(initialRelayerBalance);
    const msgHash = calculateGnosisStringHash(utils.arrayify(utils.toUtf8Bytes(contractAddress)), contractAddress);
    const relayerRequestSignature = signStringMessage(msgHash, keyPair.privateKey);
    const {body} = await chai.request(relayerUrl)
      .get(`/devices/${contractAddress}?signature=${relayerRequestSignature}`)
      .send({
        key: keyPair.publicKey,
      });
    expect(body).length(1);
    expect(body).to.deep.eq([{
      contractAddress,
      publicKey: keyPair.publicKey,
      deviceInfo: {
        ...TEST_APPLICATION_INFO,
        browser: 'node-superagent',
        city: 'unknown',
        ipAddress: '::ffff:127.0.0.1',
        platform: 'unknown',
        os: 'unknown',
        time: body[0].deviceInfo.time,
      },
    }]);
  });

  it('Deployment succeed when api key is valid', async () => {
    await relayer.setupTestPartner();
    const newKeyPair = createKeyPair();
    const newEnsName = 'name-1.mylogin.eth';
    const gasPriceForFreeDeployment = '0';
    ({signature, contractAddress} = await createFutureWalletAndPost(
      relayerUrl,
      newKeyPair,
      newEnsName,
      factoryContract,
      deployer,
      ensAddress,
      relayer.publicConfig.ensRegistrar,
      walletContract.address,
      fallbackHandlerContract.address,
      gasPriceForFreeDeployment,
    ));
    const result = await chai.request(relayerUrl)
      .post('/wallet/deploy/')
      .set('api_key', TEST_REFUND_PAYER.apiKey)
      .send({
        publicKey: newKeyPair.publicKey,
        ensName: newEnsName,
        gasPrice: gasPriceForFreeDeployment,
        gasToken: ETHER_NATIVE_TOKEN.address,
        signature,
        applicationInfo: TEST_APPLICATION_INFO,
        contractAddress,
      });
    expect(result.status).to.eq(201);
    await waitForDeploymentStatus(relayerUrl, result.body.deploymentHash, 'Success');
    expect(await provider.getCode(contractAddress)).to.eq(`0x${getDeployedBytecode(gnosisSafe.Proxy as any)}`);
    expect(await provider.getBalance(contractAddress)).to.eq(0);
  });

  it('Counterfactual deployment fail if ENS name is taken', async () => {
    await deployGnosisSafeProxyWithENS(deployer, factoryContract.address, walletContract.address, ensName, ensAddress, ensRegistrar.address, TEST_GAS_PRICE);
    const newKeyPair = createKeyPair();
    await mockToken.transfer(contractAddress, utils.parseEther('0.5'));
    const initData = await getInitData(newKeyPair, ensName, ensAddress, provider, TEST_GAS_PRICE);
    signature = calculateInitializeSignature(initData, newKeyPair.privateKey);
    const result = await chai.request(relayerUrl)
      .post('/wallet/deploy/')
      .send({
        publicKey: newKeyPair.publicKey,
        ensName,
        gasPrice: TEST_GAS_PRICE,
        gasToken: ETHER_NATIVE_TOKEN.address,
        signature,
        applicationInfo: TEST_APPLICATION_INFO,
        contractAddress,
      });
    expect(result.status).to.eq(201);
    const status = await waitForDeploymentStatus(relayerUrl, result.body.deploymentHash, 'Error');
    expect(status.transactionHash).to.be.null;
    expect(status.error).to.eq(`Error: ENS name ${ensName} already taken`);
  });

  it('Counterfactual deployment with token payment', async () => {
    const tokenTransferValue = utils.parseEther('50');
    ({signature, contractAddress} = await createFutureWalletAndPost(
      relayerUrl,
      keyPair,
      ensName,
      factoryContract,
      deployer,
      ensAddress,
      relayer.publicConfig.ensRegistrar,
      walletContract.address,
      fallbackHandlerContract.address,
      TEST_GAS_PRICE_IN_TOKEN,
      mockToken.address));
    await mockToken.transfer(contractAddress, tokenTransferValue);
    const initialRelayerBalance = await mockToken.balanceOf(deployer.address);
    const initialRelayerEthBalance = await provider.getBalance(deployer.address);
    const result = await chai.request(relayerUrl)
      .post('/wallet/deploy/')
      .send({
        publicKey: keyPair.publicKey,
        ensName,
        gasPrice: TEST_GAS_PRICE_IN_TOKEN,
        gasToken: mockToken.address,
        signature,
        applicationInfo: TEST_APPLICATION_INFO,
        contractAddress,
      });
    expect(result.status).to.eq(201, result.body);
    const status = await waitForDeploymentStatus(relayerUrl, result.body.deploymentHash, 'Success');
    expect(status.transactionHash).to.be.properHex(64);
    expect(await provider.getCode(contractAddress)).to.eq(`0x${getDeployedBytecode(gnosisSafe.Proxy as any)}`);
    expect(await mockToken.balanceOf(deployer.address)).to.eq(initialRelayerBalance.add(utils.bigNumberify(TEST_GAS_PRICE_IN_TOKEN).mul(DEPLOY_GAS_LIMIT)));
    expect(await mockToken.balanceOf(contractAddress)).to.eq(tokenTransferValue.sub(utils.bigNumberify(TEST_GAS_PRICE_IN_TOKEN).mul(DEPLOY_GAS_LIMIT)));
    const {gasUsed} = await provider.getTransactionReceipt(status.transactionHash!);
    expect(gasUsed).to.not.be.undefined;
    const expectedGasPriceInEth = safeMultiply(utils.bigNumberify(TEST_GAS_PRICE_IN_TOKEN), TEST_TOKEN_PRICE_IN_ETH);
    expect(await provider.getBalance(deployer.address)).to.eq(initialRelayerEthBalance.sub(gasUsed!.mul(expectedGasPriceInEth)));
  });

  it('Counterfactual deployment fail if not enough balance', async () => {
    const result = await chai.request(relayerUrl)
      .post('/wallet/deploy/')
      .send({
        publicKey: keyPair.publicKey,
        ensName,
        gasPrice: TEST_GAS_PRICE,
        gasToken: ETHER_NATIVE_TOKEN.address,
        signature,
        applicationInfo: TEST_APPLICATION_INFO,
        contractAddress,
      });
    expect(result.status).to.eq(201);
    const status = await waitForDeploymentStatus(relayerUrl, result.body.deploymentHash, 'Error');
    expect(status.transactionHash).to.be.null;
    expect(status.error).to.eq('Error: Not enough balance');
  });

  it('Counterfactual deployment fail if invalid ENS name', async () => {
    const invalidEnsName = 'myname.non-existing.eth';
    ({signature, contractAddress} = await createFutureWalletAndPost(relayerUrl, keyPair, ensName, factoryContract, deployer, ensAddress, relayer.publicConfig.ensRegistrar, walletContract.address, fallbackHandlerContract.address));
    await deployer.sendTransaction({to: contractAddress, value: utils.parseEther('1.0')});
    const result = await chai.request(relayerUrl)
      .post('/wallet/deploy/')
      .send({
        publicKey: keyPair.publicKey,
        ensName: invalidEnsName,
        gasPrice: TEST_GAS_PRICE,
        gasToken: ETHER_NATIVE_TOKEN.address,
        signature,
        applicationInfo: TEST_APPLICATION_INFO,
        contractAddress,
      });
    expect(result.status).to.eq(201);
    const status = await waitForDeploymentStatus(relayerUrl, result.body.deploymentHash, 'Error');
    expect(status.transactionHash).to.be.null;
    expect(status.error).to.eq(`Error: ENS domain ${invalidEnsName} does not exist or is not compatible with Universal Login`);
  });

  it('Counterfactual deployment fail if invalid signature', async () => {
    await deployer.sendTransaction({to: contractAddress, value: utils.parseEther('0.5')});
    const newKeyPair = createKeyPair();
    const initData = await getInitData(keyPair, ensName, ensAddress, provider, TEST_GAS_PRICE);
    signature = calculateInitializeSignature(initData, newKeyPair.privateKey);
    const result = await chai.request(relayerUrl)
      .post('/wallet/deploy/')
      .send({
        publicKey: keyPair.publicKey,
        ensName,
        gasPrice: TEST_GAS_PRICE,
        gasToken: ETHER_NATIVE_TOKEN.address,
        signature,
        applicationInfo: TEST_APPLICATION_INFO,
        contractAddress,
      });
    expect(result.status).to.eq(201);
    const status = await waitForDeploymentStatus(relayerUrl, result.body.deploymentHash, 'Error');
    expect(status.transactionHash).to.be.null;
    expect(status.error).to.eq('Error: Invalid signature ');
  });

  it('Endpoint for checking deployment status should return 404 for not-existing hash', async () => {
    const result = await chai.request(relayerUrl)
      .get('/wallet/deploy/0xa4ebe7c508b5ed32427f0d9fe1802fc2af027aada5e985ebc1e18ff8d11e854e');
    expect(result.status).to.eq(404);
    expect(result.body).to.eq('Not Found');
  });

  it('Counterfactual deployment fail if gasPrice is 0, when no apiKey', async () => {
    const result = await chai.request(relayerUrl)
      .post('/wallet/deploy/')
      .send({
        publicKey: keyPair.publicKey,
        ensName,
        gasPrice: '0',
        gasToken: ETHER_NATIVE_TOKEN.address,
        signature,
        applicationInfo: TEST_APPLICATION_INFO,
        contractAddress,
      });
    expect(result.status).eq(400);
    expect(result.error.text).contain('Invalid api key: undefined');
  });

  afterEach(async () => {
    await relayer.stop();
  });
});
