import chai, {expect} from 'chai';
import {Contract, utils, Wallet} from 'ethers';
import {deployContract, loadFixture, solidity, MockProvider} from 'ethereum-waffle';
import {createKeyPair, DEPLOYMENT_REFUND, ETHER_NATIVE_TOKEN, TEST_OVERRIDES_FOR_REVERT, signString} from '@unilogin/commons';
import MockToken from '../../../dist/contracts/MockToken.json';
import {encodeInitializeWithENSData} from '../../../src';
import {createFutureDeploymentWithENS, CreateFutureDeploymentWithENS, EnsDomainData} from '../../helpers/FutureDeployment';
import {ensAndMasterFixture} from '../../fixtures/walletContract';
import {switchENSNameInInitializeArgs} from '../../helpers/argumentsEncoding';
import {WalletContractInterface, WalletProxyFactoryInterface} from '../../helpers/interfaces';
import {setupInitializeWithENSArgs} from '../../helpers/ProxyUtils';
import {MAGICVALUE} from '../../../src/ERC1271/constants';

chai.use(solidity);

describe('Counterfactual Factory', () => {
  const keyPair = createKeyPair();
  let provider: MockProvider;
  let wallet: Wallet;
  let anotherWallet: Wallet;
  let factoryContract: Contract;
  let ensDomainData: EnsDomainData;
  let walletContract: Contract;
  let initializeData: any;
  let futureAddress: string;
  let signature: string;
  let createFutureDeploymentArgs: CreateFutureDeploymentWithENS;
  const gasPrice = '1000000';

  beforeEach(async () => {
    ({ensDomainData, provider, factoryContract, walletContract} = await loadFixture(ensAndMasterFixture));
    [wallet, anotherWallet] = provider.getWallets();
    createFutureDeploymentArgs = {keyPair, walletContractAddress: walletContract.address, ensDomainData, factoryContract, gasPrice, gasToken: ETHER_NATIVE_TOKEN.address};
    ({initializeData, futureAddress, signature} = createFutureDeploymentWithENS(createFutureDeploymentArgs));
  });

  it('factory contract address should be proper address', () => {
    expect(factoryContract.address).to.be.properAddress;
  });

  it('computeCounterfactualAddress function works', async () => {
    expect(futureAddress).to.be.properAddress;
  });

  it('creation fail if contract doesn`t have funds', async () => {
    await expect(factoryContract.createContract(keyPair.publicKey, initializeData, signature)).to.be.reverted;
  });

  it('should deploy contract with computed address', async () => {
    await wallet.sendTransaction({to: futureAddress, value: utils.parseEther('1.0')});
    await factoryContract.createContract(keyPair.publicKey, initializeData, signature);
    const proxyContract = new Contract(futureAddress, WalletContractInterface, wallet);
    expect(await proxyContract.keyExist(keyPair.publicKey)).to.be.true;
  });

  it('deploy with the same ens name', async () => {
    await wallet.sendTransaction({to: futureAddress, value: utils.parseEther('1.0')});
    await factoryContract.createContract(keyPair.publicKey, initializeData, signature);
    const newKeyPair = createKeyPair();
    ({initializeData, signature} = createFutureDeploymentWithENS({...createFutureDeploymentArgs, keyPair: newKeyPair}));
    await expect(factoryContract.createContract(newKeyPair.publicKey, initializeData, signature, TEST_OVERRIDES_FOR_REVERT)).to.be.revertedWith('Unable to register ENS domain');
  });

  it('only owner can create contract', async () => {
    const factoryWithAnotherWallet = new Contract(factoryContract.address, WalletProxyFactoryInterface, anotherWallet);
    await expect(factoryWithAnotherWallet.createContract(keyPair.publicKey, initializeData, signature)).to.be.reverted;
  });

  it('wallet refund after deploy', async () => {
    const {initializeData, futureAddress, signature} = createFutureDeploymentWithENS(createFutureDeploymentArgs);
    await wallet.sendTransaction({to: futureAddress, value: utils.parseEther('1.0')});
    const initBalance = await wallet.getBalance();
    const {wait} = await factoryContract.createContract(keyPair.publicKey, initializeData, signature, {gasPrice: utils.bigNumberify(createFutureDeploymentArgs.gasPrice)});
    const {gasUsed} = await wait();
    const gasPrice = utils.bigNumberify(createFutureDeploymentArgs.gasPrice);
    expect(await wallet.getBalance()).eq(initBalance.sub(gasPrice.mul(gasUsed)).add(gasPrice.mul(DEPLOYMENT_REFUND)));
  });

  it('should fail if signed ens name and passed in initialize data are different', async () => {
    const {futureAddress, signature} = createFutureDeploymentWithENS(createFutureDeploymentArgs);
    await wallet.sendTransaction({to: futureAddress, value: utils.parseEther('1.0')});
    const argsWithCorrectName = await setupInitializeWithENSArgs(createFutureDeploymentArgs);
    const argsWithInvalidName = switchENSNameInInitializeArgs(argsWithCorrectName, 'invalid-name');
    const initData = encodeInitializeWithENSData(argsWithInvalidName);
    await expect(factoryContract.createContract(keyPair.publicKey, initData, signature, TEST_OVERRIDES_FOR_REVERT)).to.be.revertedWith('Invalid signature');
  });

  it('isValidSignature', async () => {
    await wallet.sendTransaction({to: futureAddress, value: utils.parseEther('1.0')});
    await factoryContract.createContract(keyPair.publicKey, initializeData, signature);
    const proxyContract = new Contract(futureAddress, WalletContractInterface, wallet);
    const message = 'Hi, I am Justyna and I wonder if length of this message matters';
    const messageHex = utils.hexlify(utils.toUtf8Bytes(message));
    const signature2 = signString(message, keyPair.privateKey);
    expect(await proxyContract.isValidSignature(messageHex, signature2)).to.eq(MAGICVALUE);
  });

  it('return in token after deploy', async () => {
    const mockToken = await deployContract(anotherWallet, MockToken);
    const {initializeData, futureAddress, signature} = createFutureDeploymentWithENS({...createFutureDeploymentArgs, gasToken: mockToken.address});
    await mockToken.transfer(futureAddress, utils.parseEther('1.0'));
    const expectedBalance = DEPLOYMENT_REFUND.mul(gasPrice);
    await factoryContract.createContract(keyPair.publicKey, initializeData, signature, {gasPrice: utils.bigNumberify(gasPrice)});
    expect(await mockToken.balanceOf(wallet.address)).to.eq(expectedBalance);
  });
});
