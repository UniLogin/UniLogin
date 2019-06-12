import chai, {expect} from 'chai';
import {Contract, providers, Wallet, utils} from 'ethers';
import {deployContract, getWallets, solidity, loadFixture} from 'ethereum-waffle';
import {MANAGEMENT_KEY, createKeyPair} from '@universal-login/commons';
import ProxyCounterfactualFactory from '../../build/ProxyCounterfactualFactory.json';
import ProxyContract from '../../build/Proxy.json';
import WalletMaster from '../../build/WalletMaster.json';
import {getDeployData} from '../../lib';
import {createProxyDeployWithENSArgs, ensAndMasterFixture, EnsDomainData, setupInitializeArgs} from '../fixtures/walletContract';
import {computeContractAddress} from '../utils/computeContractAddress';

chai.use(solidity);


describe('Counterfactual Factory', () => {
  const keyPair = createKeyPair();
  let provider: providers.Provider;
  let deployer: Wallet;
  let wallet: Wallet;
  let anotherWallet: Wallet;
  let factoryContract: Contract;
  const salt = utils.randomBytes(32);
  let ensDomainData: EnsDomainData;
  let walletMaster: Contract;
  let initData: string;
  let initializeWithENS: any;

  before(async () => {
    ({deployer, ensDomainData, walletMaster, provider} = await loadFixture(ensAndMasterFixture));
    [wallet, anotherWallet] = getWallets(provider);
    [, initializeWithENS] = createProxyDeployWithENSArgs(keyPair.publicKey, ensDomainData, walletMaster.address);
    factoryContract = await deployContract(deployer, ProxyCounterfactualFactory);
    initData = getDeployData(ProxyContract, [walletMaster.address, '0x0']);
  });

  it('factory contract address should be proper address', () => {
    expect(factoryContract.address).to.be.properAddress;
  });

  it('computeContractAddress function works', async () => {
    const computedContractAddress = computeContractAddress(factoryContract.address, deployer.address, keyPair.publicKey, initData);
    expect(computedContractAddress).to.be.properAddress;
    const futureContractAddress = await factoryContract.computeContractAddress(deployer.address, keyPair.publicKey, initData);
    expect(futureContractAddress).to.be.properAddress;
    expect(computedContractAddress).to.eq(futureContractAddress.toLowerCase());
  });

  it('should deploy contract with computed address', async () => {
    const computedContractAddress = computeContractAddress(factoryContract.address, deployer.address, keyPair.publicKey, initData);
    await factoryContract.createContract(deployer.address, keyPair.publicKey, initData, initializeWithENS);
    expect((await factoryContract.contractAddress()).toLowerCase()).to.eq(computedContractAddress);
    const proxyContract = new Contract(computedContractAddress, WalletMaster.abi, wallet);
    expect(await proxyContract.getKeyPurpose(keyPair.publicKey)).to.eq(MANAGEMENT_KEY);
  });

  // it('deploy with the same ens name', async () => {
  //   [, initializeWithENS] = createProxyDeployWithENSArgs(anotherWallet.address, ensDomainData, walletMaster.address);
  //   const computedContractAddress = computeContractAddress(factoryContract.address, deployer.address, keyPair.publicKey, initData);
  //   await factoryContract.createContract(deployer.address, keyPair.publicKey, initData, initializeWithENS);
  //   expect((await factoryContract.contractAddress()).toLowerCase()).to.eq(computedContractAddress);
  //   const proxyContract = new Contract(computedContractAddress, WalletMaster.abi, wallet);
  //   expect(await proxyContract.getKeyPurpose(wallet.address)).to.eq(MANAGEMENT_KEY);
  // });

  it('only owner can create contract', async () => {
    const factoryWithAnotherWallet = new Contract(factoryContract.address, ProxyCounterfactualFactory.abi, anotherWallet);
    await expect(factoryWithAnotherWallet.createContract(deployer.address, keyPair.publicKey, initData, initializeWithENS)).to.be.reverted;
  });
});
