import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {solidity, loadFixture} from 'ethereum-waffle';
import {providers, Contract, ContractFactory, Wallet} from 'ethers';
import {defaultDeployOptions, createKeyPair} from '@universal-login/commons';
import ProxyContract from '../../build/Proxy.json';
import {ensAndMasterFixture, createProxyDeployWithENSArgs, EnsDomainData} from '../fixtures/walletContract';
import {encodeInitializeData} from '../../lib';

chai.use(chaiAsPromised);
chai.use(solidity);

const deployProxyCost = '290000';
const deployProxyWithENSCost = '490000';


describe('Performance test', async () => {
  const gasCosts = {} as any;
  const keyPair = createKeyPair();

  let provider: providers.Provider;
  let walletMaster: Contract;
  let ensDomainData: EnsDomainData;
  let deployer: Wallet;

  beforeEach(async () => {
    ({walletMaster, ensDomainData, deployer, provider} = await loadFixture(ensAndMasterFixture));
  });

  it('Proxy deploy without ENS', async () => {
    const initData = encodeInitializeData(keyPair.publicKey);
    const deployTransaction = {
      ...defaultDeployOptions,
      ...new ContractFactory(ProxyContract.abi, ProxyContract.bytecode).getDeployTransaction(walletMaster.address, initData)
    };
    const transaction = await deployer.sendTransaction(deployTransaction);
    const {gasUsed} = await provider.getTransactionReceipt(transaction.hash!);
    gasCosts['Proxy deploy without ENS'] = gasUsed;
    expect(gasUsed).to.be.below(deployProxyCost);
  });

  it('Proxy deploy with ENS', async () => {
    const args = createProxyDeployWithENSArgs(keyPair.publicKey, ensDomainData, walletMaster.address);
    const deployTransaction = {
      ...defaultDeployOptions,
      ...new ContractFactory(ProxyContract.abi, ProxyContract.bytecode).getDeployTransaction(...args)
    };
    const transaction = await deployer.sendTransaction(deployTransaction);
    const {gasUsed} = await provider.getTransactionReceipt(transaction.hash!);
    gasCosts['Proxy deploy with ENS'] = gasUsed;
    expect(gasUsed).to.be.below(deployProxyWithENSCost);
  });

  after(() => {
    console.log();
    for (const [label, cost] of Object.entries(gasCosts)) {
      console.log(`    ${label}: ${cost}`);
    }
  });
});
