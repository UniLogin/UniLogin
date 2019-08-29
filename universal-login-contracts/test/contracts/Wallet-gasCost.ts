import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {solidity, loadFixture} from 'ethereum-waffle';
import {providers, Contract, Wallet, utils} from 'ethers';
import {createKeyPair} from '@universal-login/commons';
import {ensAndMasterFixture} from '../fixtures/walletContract';
import {EnsDomainData, createFutureDeploymentWithENS, createFutureDeployment} from '../../lib';

chai.use(chaiAsPromised);
chai.use(solidity);

const deployProxyCost = '290000';
const deployProxyWithENSCost = '490000';


describe('Performance test', async () => {
  const gasCosts = {} as any;
  const keyPair = createKeyPair();

  let provider: providers.Provider;
  let walletContract: Contract;
  let factoryContract: Contract;
  let ensDomainData: EnsDomainData;
  let deployer: Wallet;

  beforeEach(async () => {
    ({ensDomainData, deployer, provider, factoryContract, walletContract} = await loadFixture(ensAndMasterFixture));
  });

  it('Proxy deploy without ENS', async () => {
    const {futureAddress, initializeData, signature} = createFutureDeployment(keyPair, walletContract.address, factoryContract);
    await deployer.sendTransaction({to: futureAddress, value: utils.parseEther('1.0')});
    const transaction = await factoryContract.createContract(keyPair.publicKey, initializeData, signature);
    const {gasUsed} = await provider.getTransactionReceipt(transaction.hash!);
    gasCosts['Proxy deploy without ENS'] = gasUsed;
    expect(gasUsed).to.be.below(deployProxyCost);
  });

  it('Proxy deploy with ENS', async () => {
    const {futureAddress, initializeData, signature} = createFutureDeploymentWithENS({keyPair, walletMasterAddress: walletContract.address, ensDomainData, factoryContract, gasPrice: '1000000'});
    await deployer.sendTransaction({to: futureAddress, value: utils.parseEther('1.0')});
    const transaction = await factoryContract.createContract(keyPair.publicKey, initializeData, signature);
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
