import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {solidity, loadFixture} from 'ethereum-waffle';
import {providers, Contract, Wallet, utils} from 'ethers';
import {createKeyPair, ETHER_NATIVE_TOKEN, getDeployTransaction, ContractJSON, KeyPair} from '@universal-login/commons';
import WalletContract from '../../../build/Wallet.json';
import {ensAndMasterFixture, walletContractFixture} from '../../fixtures/walletContract';
import {EnsDomainData, createFutureDeploymentWithENS, createFutureDeployment} from '../../../lib';
import {executeAddKey} from '../../helpers/ExampleMessages.js';

chai.use(chaiAsPromised);
chai.use(solidity);

const deployProxyCost = '385000';
const deployProxyWithENSCost = '570000';
const deployWalletCost = '3300000';
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
    let provider: providers.Provider;
    let keyPair: KeyPair;
    let deployer: Wallet;
    let proxyWithSigner: Contract;

    before(async () => {
      ({provider, proxyWallet, keyPair, deployer} = await loadFixture(walletContractFixture));
      proxyWithSigner = proxyWallet.connect(deployer);
    });

    it('Execute addKey function', async () => {
      const transaction = await executeAddKey(proxyWithSigner, createKeyPair().publicKey, keyPair.privateKey);
      const {gasUsed} = await provider.getTransactionReceipt(transaction.hash!);
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
