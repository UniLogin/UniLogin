import chai, {expect} from 'chai';
import {Contract, providers, Wallet, utils} from 'ethers';
import {getWallets, solidity, loadFixture} from 'ethereum-waffle';
import {MANAGEMENT_KEY, createKeyPair} from '@universal-login/commons';
import ProxyCounterfactualFactory from '../../build/ProxyCounterfactualFactory.json';
import WalletMaster from '../../build/WalletMaster.json';
import {EnsDomainData, createFutureDeploymentWithRefund, CreateFutureDeploymentWithRefundArgs, encodeInitializeWithRefundData, setupInitializeWithENSAndRefundArgs} from '../../lib';
import {ensAndMasterFixture} from '../fixtures/walletContract';
import {switchENSNameInInitializeArgs} from '../utils/utils';

chai.use(solidity);


describe('Counterfactual Factory', () => {
  const keyPair = createKeyPair();
  let provider: providers.Provider;
  let wallet: Wallet;
  let anotherWallet: Wallet;
  let factoryContract: Contract;
  let ensDomainData: EnsDomainData;
  let walletMaster: Contract;
  let initializeData: any;
  let futureAddress: string;
  let createFutureDeploymentArgs: CreateFutureDeploymentWithRefundArgs;

  beforeEach(async () => {
    ({ensDomainData, provider, factoryContract, walletMaster} = await loadFixture(ensAndMasterFixture));
    [wallet, anotherWallet] = getWallets(provider);
    createFutureDeploymentArgs = {keyPair, walletMasterAddress: walletMaster.address, ensDomainData, factoryContract, relayerAddress: wallet.address, gasPrice: '1000000'};
    ({initializeData, futureAddress} = await createFutureDeploymentWithRefund(createFutureDeploymentArgs));
  });

  it('factory contract address should be proper address', () => {
    expect(factoryContract.address).to.be.properAddress;
  });

  it('computeContractAddress function works', async () => {
    expect(futureAddress).to.be.properAddress;
  });

  it('creation fail if contract doesn`t have funds', async () => {
    await expect(factoryContract.createContract(keyPair.publicKey, initializeData)).to.be.reverted;
  });

  it('should deploy contract with computed address', async () => {
    await wallet.sendTransaction({to: futureAddress, value: utils.parseEther('1.0')});
    await factoryContract.createContract(keyPair.publicKey, initializeData);
    const proxyContract = new Contract(futureAddress, WalletMaster.abi, wallet);
    expect(await proxyContract.getKeyPurpose(keyPair.publicKey)).to.eq(MANAGEMENT_KEY);
  });

  it('deploy with the same ens name', async () => {
    await wallet.sendTransaction({to: futureAddress, value: utils.parseEther('1.0')});
    await factoryContract.createContract(keyPair.publicKey, initializeData);
    const newKeyPair = createKeyPair();
    ({initializeData} = await createFutureDeploymentWithRefund({...createFutureDeploymentArgs, keyPair: newKeyPair}));
    await expect(factoryContract.createContract(newKeyPair.publicKey, initializeData)).to.be.revertedWith('Unable to register ENS domain');
  });

  it('only owner can create contract', async () => {
    const factoryWithAnotherWallet = new Contract(factoryContract.address, ProxyCounterfactualFactory.abi, anotherWallet);
    await expect(factoryWithAnotherWallet.createContract(keyPair.publicKey, initializeData)).to.be.reverted;
  });

  it('createContract should fail if publicKey and publicKey in initializeData are diffrent', async () => {
    const newKeyPair = createKeyPair();
    ({initializeData} = await createFutureDeploymentWithRefund({...createFutureDeploymentArgs, keyPair: newKeyPair}));
    await expect(factoryContract.createContract(keyPair.publicKey, initializeData)).to.be.revertedWith('Public key and initialize public key are different');
  });

  it('wallet refund after deploy', async () => {
    const {initializeData, futureAddress} = await createFutureDeploymentWithRefund(createFutureDeploymentArgs);
    await wallet.sendTransaction({to: futureAddress, value: utils.parseEther('1.0')});
    const initBalance = await wallet.getBalance();
    await factoryContract.createContract(keyPair.publicKey, initializeData, {gasPrice: utils.bigNumberify(createFutureDeploymentArgs.gasPrice)});
    expect(await wallet.getBalance()).to.be.above(initBalance);
  });

  it('should fail if signed ens name and passed in initialize data are different', async () => {
    const {futureAddress} = await createFutureDeploymentWithRefund(createFutureDeploymentArgs);
    await wallet.sendTransaction({to: futureAddress, value: utils.parseEther('1.0')});
    const argsWithCorrectName = await setupInitializeWithENSAndRefundArgs(createFutureDeploymentArgs);
    const argsWithInvalidName = switchENSNameInInitializeArgs(argsWithCorrectName, 'invalid-name');
    const initData = encodeInitializeWithRefundData(argsWithInvalidName);
    await expect(factoryContract.createContract(keyPair.publicKey, initData)).to.be.revertedWith('Unable to register ENS domain');
  });
});
