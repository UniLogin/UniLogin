import chai, {expect} from 'chai';
import {Contract, providers, Wallet, utils} from 'ethers';
import {deployContract, getWallets, solidity, loadFixture} from 'ethereum-waffle';
import Factory from '../../build/Factory.json';
import ProxyContract from '../../build/Proxy.json';
import {createProxyDeployWithENSArgs, ensAndMasterFixture, EnsDomainData} from '../fixtures/walletContract';
import {getDeployData} from '../../lib';
import {computeContractAddress} from '../utils/computeContractAddress';

chai.use(solidity);


describe('Counterfactual Factory', () => {
  let provider: providers.Provider;
  let deployer: Wallet;
  let wallet: Wallet;
  let factoryContract: Contract;
  let salt = utils.randomBytes(32);
  let ensDomainData: EnsDomainData;
  let walletMaster: Contract;
  let proxyArgs: string[];

  before(async () => {
    ({deployer, ensDomainData, walletMaster, provider} = await loadFixture(ensAndMasterFixture));
    [wallet] = getWallets(provider);
    proxyArgs = createProxyDeployWithENSArgs(wallet.address, ensDomainData, walletMaster.address);
    factoryContract = await deployContract(deployer, Factory);
  });

  it('factory contract address should be proper address', () => {
    expect(factoryContract.address).to.be.properAddress;
  });

  it('should compute contract address', async () => {
    const initData = getDeployData(ProxyContract, proxyArgs);
    const computedContractAddress = computeContractAddress(factoryContract.address, deployer.address, salt, initData);
    expect(computedContractAddress).to.be.properAddress;
    const futureContractAddress = await factoryContract.computeContractAddress(deployer.address, salt, initData);
    expect(futureContractAddress).to.be.properAddress;
    expect(computedContractAddress).to.eq(futureContractAddress.toLowerCase());
  });
});
