import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
import {utils, providers, Contract, Wallet} from 'ethers';
import {createKeyPair, getDeployedBytecode, computeCounterfactualAddress, KeyPair, calculateInitializeSignature, TEST_GAS_PRICE, ETHER_NATIVE_TOKEN, DEPLOY_GAS_LIMIT, TEST_APPLICATION_INFO, TEST_REFUND_PAYER, getDeployData} from '@unilogin/commons';
import {beta2, signStringMessage, calculateGnosisStringHash, gnosisSafe} from '@unilogin/contracts';
import {startRelayerWithRefund, getInitData} from '../testhelpers/http';
import {RelayerUnderTest} from '../../src';
import {waitForDeploymentStatus} from '../testhelpers/waitForDeploymentStatus';
import {deployGnosisSafeProxyWithENS} from '../testhelpers/createGnosisSafeContract';
import {createFutureWallet} from '../testhelpers/setupWalletService';
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
  let initCode: string;
  const relayerPort = '33511';
  const relayerUrl = `http://localhost:${relayerPort}`;
  const ensName = 'myname.mylogin.eth';
  let signature: string;
  let ensRegistrar: Contract;

  beforeEach(async () => {
    ({provider, relayer, deployer, walletContract, factoryContract, mockToken, ensAddress, ensRegistrar, fallbackHandlerContract} = await startRelayerWithRefund(relayerPort));
    keyPair = createKeyPair();
    initCode = getDeployData(beta2.WalletProxy as any, [walletContract.address]);
    ({signature, contractAddress} = await createFutureWallet(keyPair, ensName, factoryContract, deployer, ensAddress, relayer.publicConfig.ensRegistrar, walletContract.address, fallbackHandlerContract.address));
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
    ({signature, contractAddress} = await createFutureWallet(
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
    signature = await calculateInitializeSignature(initData, newKeyPair.privateKey);
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
    ({signature, contractAddress} = await createFutureWallet(
      keyPair,
      ensName,
      factoryContract,
      deployer,
      ensAddress,
      relayer.publicConfig.ensRegistrar,
      walletContract.address,
      fallbackHandlerContract.address,
      TEST_GAS_PRICE,
      mockToken.address));
    await deployer.sendTransaction({to: contractAddress, value: utils.parseEther('0.5')});
    await mockToken.transfer(contractAddress, utils.parseEther('0.5'));
    const initialRelayerBalance = await mockToken.balanceOf(deployer.address);
    const result = await chai.request(relayerUrl)
      .post('/wallet/deploy/')
      .send({
        publicKey: keyPair.publicKey,
        ensName,
        gasPrice: TEST_GAS_PRICE,
        gasToken: mockToken.address,
        signature,
        applicationInfo: TEST_APPLICATION_INFO,
        contractAddress,
      });
    expect(result.status).to.eq(201);
    const status = await waitForDeploymentStatus(relayerUrl, result.body.deploymentHash, 'Success');
    expect(status.transactionHash).to.be.properHex(64);
    expect(await provider.getCode(contractAddress)).to.eq(`0x${getDeployedBytecode(gnosisSafe.Proxy as any)}`);
    expect(await mockToken.balanceOf(deployer.address)).to.eq(initialRelayerBalance.add(DEPLOY_GAS_LIMIT));
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
    contractAddress = computeCounterfactualAddress(factoryContract.address, keyPair.publicKey, initCode);
    await deployer.sendTransaction({to: contractAddress, value: utils.parseEther('1.0')});
    const initData = await getInitData(keyPair, invalidEnsName, ensAddress, provider, TEST_GAS_PRICE);
    signature = await calculateInitializeSignature(initData, keyPair.privateKey);
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
    signature = await calculateInitializeSignature(initData, newKeyPair.privateKey);
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
