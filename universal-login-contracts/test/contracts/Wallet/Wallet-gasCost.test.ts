import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {solidity, loadFixture} from 'ethereum-waffle';
import {providers, Contract, Wallet, utils} from 'ethers';
import {createKeyPair, ETHER_NATIVE_TOKEN, getDeployTransaction, ContractJSON, KeyPair} from '@unilogin/commons';
import WalletContract from '../../../dist/contracts/Wallet.json';
import {ensAndMasterFixture, walletContractFixture} from '../../fixtures/walletContract';
import {createFutureDeploymentWithENS, createFutureDeployment, EnsDomainData} from '../../helpers/FutureDeployment';
import {executeAddKey} from '../../helpers/ExampleMessages';

chai.use(chaiAsPromised);
chai.use(solidity);

const deployProxyCost = '400000';
const deployProxyWithENSCost = '595000';
const deployWalletCost = '3400000';
const executeAddKeyCost = '103000';

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
    const {futureAddress, initializeData, signature} = createFutureDeploymentWithENS({keyPair, walletContractAddress: walletContract.address, ensDomainData, factoryContract, gasPrice: '1000000', gasToken: ETHER_NATIVE_TOKEN.address});
    await deployer.sendTransaction({to: futureAddress, value: utils.parseEther('1.0')});
    const transaction = await factoryContract.createContract(keyPair.publicKey, initializeData, signature);
    const {gasUsed} = await provider.getTransactionReceipt(transaction.hash!);
    gasCosts['Proxy deploy with ENS'] = gasUsed;
    expect(gasUsed).to.be.below(deployProxyWithENSCost);
  });

  it('Wallet deployment', async () => {
    const deployTransaction = getDeployTransaction(WalletContract as ContractJSON);
    const transaction = await deployer.sendTransaction(deployTransaction);
    const {gasUsed} = await provider.getTransactionReceipt(transaction.hash!);
    gasCosts['Wallet deployment'] = gasUsed;
    expect(gasUsed).to.be.below(deployWalletCost);
  });

  describe('Functions call', () => {
    let proxyWallet: Contract;
    let providerWithENS: providers.Provider;
    let keyPair: KeyPair;
    let deployer: Wallet;
    let proxyWithSigner: Contract;

    before(async () => {
      ({providerWithENS, proxyWallet, keyPair, deployer} = await loadFixture(walletContractFixture));
      proxyWithSigner = proxyWallet.connect(deployer);
    });

    it('Execute addKey function', async () => {
      const transaction = await executeAddKey(proxyWithSigner, createKeyPair().publicKey, keyPair.privateKey);
      const {gasUsed} = await providerWithENS.getTransactionReceipt(transaction.hash!);
      gasCosts['Execute addKey function'] = gasUsed;
      expect(gasUsed).to.be.below(executeAddKeyCost);
    });
  });

  after(() => {
    console.log();
    for (const [label, cost] of Object.entries(gasCosts)) {
      console.log(`    ${label}: ${cost}`);
    }
  });
});
