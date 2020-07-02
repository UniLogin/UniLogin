import {expect} from 'chai';
import {loadFixture, deployContract, MockProvider} from 'ethereum-waffle';
import {basicENS} from '@unilogin/commons/testutils';
import {utils, Wallet, Contract} from 'ethers';
import {createKeyPair, ETHER_NATIVE_TOKEN, TEST_GAS_PRICE, computeContractAddress, TEST_OVERRIDES_FOR_REVERT} from '@unilogin/commons';
import WalletContract from '../../../dist/contracts/Wallet.json';

describe('WalletImplementation', () => {
  let provider: MockProvider;
  let publicResolver: string;
  let registrarAddress: string;
  let ensAddress: string;
  let wallet: Wallet;
  let otherWallet: Wallet;
  let ensArgs: string[];
  let walletContract: Contract;

  const keyPair = createKeyPair();
  const domain = 'mylogin.eth';
  const label = 'alex';
  const hashLabel = utils.keccak256(utils.toUtf8Bytes(label));
  const name = `${label}.${domain}`;
  const node = utils.namehash(name);

  beforeEach(async () => {
    ({provider, publicResolver, registrarAddress, ensAddress, wallet} = await loadFixture(basicENS));
    [, , , otherWallet] = provider.getWallets();
    ensArgs = [hashLabel, name, node, ensAddress, registrarAddress, publicResolver];
    const transactionCount = await wallet.getTransactionCount();
    const futureAddress = computeContractAddress(wallet.address, transactionCount);
    await otherWallet.sendTransaction({to: futureAddress, value: utils.parseEther('1')});
    walletContract = await deployContract(wallet, WalletContract, [], {gasLimit: 5000000});
  });

  it('initializeWithENS', async () => {
    await walletContract.initializeWithENS(keyPair.publicKey, ...ensArgs, TEST_GAS_PRICE, ETHER_NATIVE_TOKEN.address);
    expect(utils.formatEther(await provider.getBalance(walletContract.address))).to.eq('0.9886');
  });

  it('initialize', async () => {
    await walletContract.initialize(keyPair.publicKey, TEST_GAS_PRICE, ETHER_NATIVE_TOKEN.address);
    expect(utils.formatEther(await provider.getBalance(walletContract.address))).to.eq('0.9886');
  });

  it('can`t initializeWithENS twice', async () => {
    await walletContract.initializeWithENS(keyPair.publicKey, ...ensArgs, '0', ETHER_NATIVE_TOKEN.address);
    await expect(walletContract.initializeWithENS(keyPair.publicKey, ...ensArgs, '0', ETHER_NATIVE_TOKEN.address, TEST_OVERRIDES_FOR_REVERT)).to.be.revertedWith('Contract instance has already been initialized');
  });

  it('can`t initialize twice', async () => {
    await walletContract.initialize(keyPair.publicKey, TEST_GAS_PRICE, ETHER_NATIVE_TOKEN.address);
    await expect(walletContract.initialize(keyPair.publicKey, TEST_GAS_PRICE, ETHER_NATIVE_TOKEN.address, TEST_OVERRIDES_FOR_REVERT)).to.be.revertedWith('Contract instance has already been initialized');
  });

  it('Can`t initalize twice with and without ENS', async () => {
    await walletContract.initialize(keyPair.publicKey, TEST_GAS_PRICE, ETHER_NATIVE_TOKEN.address);
    await expect(walletContract.initializeWithENS(keyPair.publicKey, ...ensArgs, '0', ETHER_NATIVE_TOKEN.address, TEST_OVERRIDES_FOR_REVERT)).to.be.revertedWith('Contract instance has already been initialized');
  });
});
