import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {solidity, loadFixture} from 'ethereum-waffle';
import {providers, Contract, ContractFactory, Wallet} from 'ethers';
import {defaultDeployOptions} from '@universal-login/commons';
import ProxyContract from '../../build/Proxy.json';
import {ensAndMasterFixture, setupInitializeArgs} from '../fixtures/walletContract';
import {createKey, getInitData, getInitWithENSData} from '../../lib';

chai.use(chaiAsPromised);
chai.use(solidity);

const deployProxyCost = '290000';
const deployProxyWithENSCost = '490000';


describe('Performance test', async () => {
  const gasCosts = {} as any;
  const key = createKey();

  let provider: providers.Provider;
  let walletMaster: Contract;
  let ensAddress: string;
  let resolverAddress: string;
  let registrarAddress: string;
  let deployer: Wallet;

  beforeEach(async () => {
    ({walletMaster, ensAddress, resolverAddress, registrarAddress, deployer, provider} = await loadFixture(ensAndMasterFixture));
  });

  it('Proxy deploy without ENS', async () => {
    const initData = getInitData(key.publicKey);
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
    const initializeArgs = setupInitializeArgs({key: key.publicKey, ensAddress, resolverAddress, registrarAddress});
    const initData = getInitWithENSData(initializeArgs);
    const deployTransaction = {
      ...defaultDeployOptions,
      ...new ContractFactory(ProxyContract.abi, ProxyContract.bytecode).getDeployTransaction(walletMaster.address, initData)
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
