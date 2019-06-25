import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {solidity, loadFixture} from 'ethereum-waffle';
import {providers, Contract, Wallet, utils} from 'ethers';
import {createKeyPair} from '@universal-login/commons';
import {ensAndMasterFixture, EnsDomainData, setupInitializeWithEnsAndFutureAddress, setupInitializeAndFutureAddress} from '../fixtures/walletContract';

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
  let factoryContract: Contract;

  beforeEach(async () => {
    ({walletMaster, ensDomainData, deployer, provider, factoryContract} = await loadFixture(ensAndMasterFixture));
  });

  it('Proxy deploy without ENS using factory contract', async () => {
    const {futureAddress, initializeData} = setupInitializeAndFutureAddress(keyPair.publicKey, walletMaster.address, factoryContract);
    await deployer.sendTransaction({to: futureAddress, value: utils.parseEther('1.0')});
    const transaction = await factoryContract.createContract(keyPair.publicKey, initializeData);
    const {gasUsed} = await provider.getTransactionReceipt(transaction.hash!);
    gasCosts['Proxy deploy without ENS'] = gasUsed;
    expect(gasUsed).to.be.below(deployProxyCost);
  });

  it('Proxy deploy with ENS using factory contract', async () => {
    const {futureAddress, initializeWithENS} = setupInitializeWithEnsAndFutureAddress(keyPair.publicKey, walletMaster.address, ensDomainData, factoryContract, deployer.address);
    await deployer.sendTransaction({to: futureAddress, value: utils.parseEther('1.0')});
    const transaction = await factoryContract.createContract(keyPair.publicKey, initializeWithENS);
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
