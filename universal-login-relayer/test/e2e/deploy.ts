import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
import {utils, providers, Contract, Wallet} from 'ethers';
import {getDeployData} from '@universal-login/contracts';
import {createKeyPair, getDeployedBytecode, computeContractAddress, KeyPair, calculateInitializeSignature, TEST_GAS_PRICE} from '@universal-login/commons';
import ProxyContract from '@universal-login/contracts/build/KitsuneProxy.json';
import {startRelayerWithRefund, createWalletCounterfactually, getInitData} from '../helpers/http';
import Relayer from '../../lib';

chai.use(chaiHttp);

describe('E2E: Relayer - counterfactual deployment', () => {
  let relayer: Relayer;
  let provider: providers.Provider;
  let deployer: Wallet;
  let walletMaster: Contract;
  let factoryContract: Contract;
  let mockToken: Contract;
  let keyPair: KeyPair;
  let ensAddress: string;
  let contractAddress: string;
  let initCode: string;
  const relayerPort = '33511';
  const relayerUrl = `http://localhost:${relayerPort}`;
  const ensName = 'myname.mylogin.eth';
  let signature: string;

  beforeEach(async () => {
    ({provider, relayer, deployer, walletMaster, factoryContract, mockToken, ensAddress} = await startRelayerWithRefund(relayerPort));
    keyPair = createKeyPair();
    initCode = getDeployData(ProxyContract as any, [walletMaster.address, '0x0']);
    contractAddress = computeContractAddress(factoryContract.address, keyPair.publicKey, initCode);
    const initData = await getInitData(keyPair, ensName, ensAddress, provider, TEST_GAS_PRICE);
    signature = await calculateInitializeSignature(initData, keyPair.privateKey);
  });

  it('Counterfactual deployment with ether payment and refund', async () => {
    await deployer.sendTransaction({to: contractAddress, value: utils.parseEther('0.5')});
    const initialRelayerBalance = await deployer.getBalance();
    const result = await chai.request(relayerUrl)
      .post(`/wallet/deploy/`)
      .send({
        publicKey: keyPair.publicKey,
        ensName,
        gasPrice: TEST_GAS_PRICE,
        signature
      });
    expect(result.status).to.eq(201);
    expect(await provider.getCode(contractAddress)).to.eq(`0x${getDeployedBytecode(ProxyContract as any)}`);
    expect(await deployer.getBalance()).to.be.above(initialRelayerBalance);
  });


  it('Counterfactual deployment fail if ENS name is taken', async () => {
    await createWalletCounterfactually(deployer, relayerUrl, keyPair, walletMaster.address, factoryContract.address, ensAddress, ensName);
    const newKeyPair = createKeyPair();
    contractAddress = computeContractAddress(factoryContract.address, newKeyPair.publicKey, initCode);
    await mockToken.transfer(contractAddress, utils.parseEther('0.5'));
    const initData = await getInitData(newKeyPair, ensName, ensAddress, provider, TEST_GAS_PRICE);
    signature = await calculateInitializeSignature(initData, newKeyPair.privateKey);
    const result = await chai.request(relayerUrl)
      .post(`/wallet/deploy/`)
      .send({
        publicKey: newKeyPair.publicKey,
        ensName,
        gasPrice: TEST_GAS_PRICE,
        signature
      });
    expect(result.body.error).to.eq(`Error: ENS name ${ensName} already taken`);
  });


  it('Counterfactual deployment with token payment', async () => {
    await deployer.sendTransaction({to: contractAddress, value: utils.parseEther('0.5')});
    await mockToken.transfer(contractAddress, utils.parseEther('0.5'));
    const result = await chai.request(relayerUrl)
      .post(`/wallet/deploy/`)
      .send({
        publicKey: keyPair.publicKey,
        ensName,
        gasPrice: TEST_GAS_PRICE,
        signature
      });
    expect(result.status).to.eq(201);
    expect(await provider.getCode(contractAddress)).to.eq(`0x${getDeployedBytecode(ProxyContract as any)}`);
  });

  it('Counterfactual deployment fail if not enough balance', async () => {
    const result = await chai.request(relayerUrl)
      .post(`/wallet/deploy/`)
      .send({
        publicKey: keyPair.publicKey,
        ensName,
        gasPrice: TEST_GAS_PRICE,
        signature
      });
    expect(result.status).to.eq(402);
    expect(result.body.type).to.eq('NotEnoughBalance');
    expect(result.body.error).to.eq(`Error: Not enough balance`);
  });

  it('Counterfactual deployment fail if invalid ENS name', async () => {
    const invalidEnsName = 'myname.non-existing.eth';
    const initData = await getInitData(keyPair, invalidEnsName, ensAddress, provider, TEST_GAS_PRICE);
    signature = await calculateInitializeSignature(initData, keyPair.privateKey);
    const result = await chai.request(relayerUrl)
      .post(`/wallet/deploy/`)
      .send({
        publicKey: keyPair.publicKey,
        ensName: invalidEnsName,
        gasPrice: TEST_GAS_PRICE,
        signature
      });
    expect(result.status).to.eq(404);
    expect(result.body.type).to.eq('NotFound');
    expect(result.body.error).to.eq(`Error: ENS domain ${invalidEnsName} does not exist or is not compatible with Universal Login`);
  });

  it('Counterfactual deployment fail if invalid signature', async () => {
    await deployer.sendTransaction({to: contractAddress, value: utils.parseEther('0.5')});
    const newKeyPair = createKeyPair();
    const initData = await getInitData(keyPair, ensName, ensAddress, provider, TEST_GAS_PRICE);
    signature = await calculateInitializeSignature(initData, newKeyPair.privateKey);
    const result = await chai.request(relayerUrl)
      .post(`/wallet/deploy/`)
      .send({
        publicKey: keyPair.publicKey,
        ensName,
        gasPrice: TEST_GAS_PRICE,
        signature
      });
    expect(result.body.type).to.eq('InvalidSignature');
    expect(result.body.error).to.eq(`Error: Invalid signature `);
  });

  afterEach(async () => {
    await relayer.stop();
  });
});
