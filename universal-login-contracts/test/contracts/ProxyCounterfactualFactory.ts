import chai, {expect} from 'chai';
import {Contract, providers, Wallet, utils} from 'ethers';
import {deployContract, getWallets, solidity, loadFixture} from 'ethereum-waffle';
import {MANAGEMENT_KEY} from '@universal-login/commons';
import ProxyCounterfactualFactory from '../../build/ProxyCounterfactualFactory.json';
import ProxyContract from '../../build/Proxy.json';
import WalletMaster from '../../build/WalletMaster.json';
import {getDeployData} from '../../lib';
import {createProxyDeployWithENSArgs, ensAndMasterFixture, EnsDomainData, setupInitializeArgs} from '../fixtures/walletContract';
import {computeContractAddress} from '../utils/computeContractAddress';

chai.use(solidity);


describe('Counterfactual Factory', () => {
  let provider: providers.Provider;
  let deployer: Wallet;
  let wallet: Wallet;
  let factoryContract: Contract;
  const salt = utils.randomBytes(32);
  let ensDomainData: EnsDomainData;
  let walletMaster: Contract;
  let initData: string;
  let initializeWithENS: any;

  before(async () => {
    ({deployer, ensDomainData, walletMaster, provider} = await loadFixture(ensAndMasterFixture));
    [wallet] = getWallets(provider);
    [, initializeWithENS] = createProxyDeployWithENSArgs(wallet.address, ensDomainData, walletMaster.address);
    factoryContract = await deployContract(deployer, ProxyCounterfactualFactory);
    initData = getDeployData(ProxyContract, [walletMaster.address, '0x0']);
  });

  it('factory contract address should be proper address', () => {
    expect(factoryContract.address).to.be.properAddress;
  });

  it('computeContractAddress function works', async () => {
    const computedContractAddress = computeContractAddress(factoryContract.address, deployer.address, salt, initData);
    expect(computedContractAddress).to.be.properAddress;
    const futureContractAddress = await factoryContract.computeContractAddress(deployer.address, salt, initData);
    expect(futureContractAddress).to.be.properAddress;
    expect(computedContractAddress).to.eq(futureContractAddress.toLowerCase());
  });

  it('should deploy contract with computed address', async () => {
    const computedContractAddress = computeContractAddress(factoryContract.address, deployer.address, salt, initData);
    const tx = await factoryContract.createContract(deployer.address, salt, initData, initializeWithENS);
    console.log((await provider.getTransactionReceipt(tx.hash))!.gasUsed!.toString())
    expect((await factoryContract.contractAddress()).toLowerCase()).to.eq(computedContractAddress);
    const proxyContract = new Contract(computedContractAddress, WalletMaster.abi, wallet);
    expect(await proxyContract.getKeyPurpose(wallet.address)).to.eq(MANAGEMENT_KEY);
  });
});
