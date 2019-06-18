import chai, {expect} from 'chai';
import {Contract, providers, Wallet} from 'ethers';
import {getWallets, solidity, loadFixture} from 'ethereum-waffle';
import {MANAGEMENT_KEY, createKeyPair, computeContractAddress} from '@universal-login/commons';
import ProxyCounterfactualFactory from '../../build/ProxyCounterfactualFactory.json';
import ProxyContract from '../../build/Proxy.json';
import WalletMaster from '../../build/WalletMaster.json';
import {getDeployData, deployFactory} from '../../lib';
import {createProxyDeployWithENSArgs, ensAndMasterFixture, EnsDomainData} from '../fixtures/walletContract';

chai.use(solidity);


describe('Counterfactual Factory', () => {
  const keyPair = createKeyPair();
  let provider: providers.Provider;
  let deployer: Wallet;
  let wallet: Wallet;
  let anotherWallet: Wallet;
  let factoryContract: Contract;
  let ensDomainData: EnsDomainData;
  let walletMaster: Contract;
  let initData: string;
  let initializeWithENS: any;

  beforeEach(async () => {
    ({deployer, ensDomainData, walletMaster, provider} = await loadFixture(ensAndMasterFixture));
    [wallet, anotherWallet] = getWallets(provider);
    [, initializeWithENS] = createProxyDeployWithENSArgs(keyPair.publicKey, ensDomainData, walletMaster.address);
    factoryContract = await deployFactory(deployer, walletMaster.address);
    initData = getDeployData(ProxyContract, [walletMaster.address, '0x0']);
  });

  it('factory contract address should be proper address', () => {
    expect(factoryContract.address).to.be.properAddress;
  });

  it('computeContractAddress function works', async () => {
    const computedContractAddress = computeContractAddress(factoryContract.address, keyPair.publicKey, initData);
    expect(computedContractAddress).to.be.properAddress;
  });

  it('should deploy contract with computed address', async () => {
    const computedContractAddress = computeContractAddress(factoryContract.address, keyPair.publicKey, initData);
    await factoryContract.createContract(keyPair.publicKey, initializeWithENS);
    const proxyContract = new Contract(computedContractAddress, WalletMaster.abi, wallet);
    expect(await proxyContract.getKeyPurpose(keyPair.publicKey)).to.eq(MANAGEMENT_KEY);
  });

  it('deploy with the same ens name', async () => {
    await factoryContract.createContract(keyPair.publicKey, initializeWithENS);
    const newKeyPair = createKeyPair();
    [, initializeWithENS] = createProxyDeployWithENSArgs(newKeyPair.publicKey, ensDomainData, walletMaster.address);
    await expect(factoryContract.createContract(newKeyPair.publicKey, initializeWithENS)).to.be.revertedWith('Unable to register ENS domain');
  });

  it('only owner can create contract', async () => {
    const factoryWithAnotherWallet = new Contract(factoryContract.address, ProxyCounterfactualFactory.abi, anotherWallet);
    await expect(factoryWithAnotherWallet.createContract(keyPair.publicKey, initializeWithENS)).to.be.reverted;
  });
});
