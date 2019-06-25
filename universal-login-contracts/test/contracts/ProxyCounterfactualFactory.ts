import chai, {expect} from 'chai';
import {Contract, providers, Wallet, utils} from 'ethers';
import {getWallets, solidity, loadFixture} from 'ethereum-waffle';
import {MANAGEMENT_KEY, createKeyPair, computeContractAddress} from '@universal-login/commons';
import ProxyCounterfactualFactory from '../../build/ProxyCounterfactualFactory.json';
import ProxyContract from '../../build/Proxy.json';
import WalletMaster from '../../build/WalletMaster.json';
import {getDeployData, EnsDomainData, createProxyDeployWithENSArgs} from '../../lib';
import {ensAndMasterFixture} from '../fixtures/walletContract';

chai.use(solidity);

describe('Counterfactual Factory', () => {
  const keyPair = createKeyPair();
  let provider: providers.Provider;
  let deployer: Wallet;
  let anotherWallet: Wallet;
  let factoryContract: Contract;
  let ensDomainData: EnsDomainData;
  let walletMaster: Contract;
  let initData: string;
  let initializeWithENS: any;
  let computedContractAddress: string;

  beforeEach(async () => {
    ({ensDomainData, walletMaster, provider, factoryContract, deployer} = await loadFixture(ensAndMasterFixture));
    [, anotherWallet] = getWallets(provider);
    [, initializeWithENS] = createProxyDeployWithENSArgs(keyPair.publicKey, ensDomainData, walletMaster.address, deployer.address);
    initData = getDeployData(ProxyContract as any, [walletMaster.address, '0x0']);
    computedContractAddress = computeContractAddress(factoryContract.address, keyPair.publicKey, initData);
  });

  it('factory contract address should be proper address', () => {
    expect(factoryContract.address).to.be.properAddress;
  });

  it('computeContractAddress function works', async () => {
    expect(computedContractAddress).to.be.properAddress;
  });

  it('should deploy contract with computed address', async () => {
    await anotherWallet.sendTransaction({to: computedContractAddress, value: utils.parseEther('10.0')});
    await factoryContract.createContract(keyPair.publicKey, initializeWithENS);
    const proxyContract = new Contract(computedContractAddress, WalletMaster.abi, deployer);
    expect(await proxyContract.getKeyPurpose(keyPair.publicKey)).to.eq(MANAGEMENT_KEY);
  });

  it('deploy with the same ens name', async () => {
    await anotherWallet.sendTransaction({to: computedContractAddress, value: utils.parseEther('10.0')});
    await factoryContract.createContract(keyPair.publicKey, initializeWithENS);
    const newKeyPair = createKeyPair();
    [, initializeWithENS] = createProxyDeployWithENSArgs(newKeyPair.publicKey, ensDomainData, walletMaster.address, deployer.address);
    await expect(factoryContract.createContract(newKeyPair.publicKey, initializeWithENS)).to.be.revertedWith('Unable to register ENS domain');
  });

  it('only owner can create contract', async () => {
    const factoryWithAnotherWallet = new Contract(factoryContract.address, ProxyCounterfactualFactory.abi, anotherWallet);
    await expect(factoryWithAnotherWallet.createContract(keyPair.publicKey, initializeWithENS)).to.be.reverted;
  });

  it('createContract should fail if publicKey and publicKey in initializeWithENS are diffrent', async () => {
    const newKeyPair = createKeyPair();
    [, initializeWithENS] = createProxyDeployWithENSArgs(newKeyPair.publicKey, ensDomainData, walletMaster.address, deployer.address);
    await expect(factoryContract.createContract(keyPair.publicKey, initializeWithENS)).to.be.revertedWith('Public key and initialize public key are different');
  });

  it('Wallet refund after deploy', async () => {
    await anotherWallet.sendTransaction({to: computedContractAddress, value: utils.parseEther('10.0')});
    const relayerBalance = await deployer.getBalance();
    await factoryContract.createContract(keyPair.publicKey, initializeWithENS, {gasPrice: 1});
    expect(await deployer.getBalance()).to.be.above(relayerBalance);
  });
});
