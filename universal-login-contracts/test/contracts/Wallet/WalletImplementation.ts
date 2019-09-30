import {expect} from 'chai';
import {loadFixture, deployContract, getWallets} from 'ethereum-waffle';
import {basicENS} from '@universal-login/commons/testutils';
import {utils, Wallet, providers} from 'ethers';
import {createKeyPair, ETHER_NATIVE_TOKEN, TEST_GAS_PRICE, computeContractAddress} from '@universal-login/commons';
import WalletContract from '../../../build/Wallet.json';


describe('WalletImplementation', () => {
  let provider: providers.Provider;
  let publicResolver: string;
  let registrarAddress: string;
  let ensAddress: string;
  let wallet: Wallet;
  let otherWallet: Wallet;
  let ensArgs: string[];

  const keyPair = createKeyPair();
  const domain = 'mylogin.eth';
  const label = 'alex';
  const hashLabel = utils.keccak256(utils.toUtf8Bytes(label));
  const name = `${label}.${domain}`;
  const node = utils.namehash(name);

  beforeEach(async () => {
    ({provider, publicResolver, registrarAddress, ensAddress, wallet} = await loadFixture(basicENS));
    [, , , otherWallet] = getWallets(provider);
    ensArgs = [hashLabel, name, node, ensAddress, registrarAddress, publicResolver];
    const transactionCount = await wallet.getTransactionCount();
    const futureAddress = computeContractAddress(wallet.address, transactionCount);
    await otherWallet.sendTransaction({to: futureAddress, value: utils.parseEther('1')});
  });

  it('wallet implementation deployed and initialized successfully', async () => {
    const walletContract = await deployContract(wallet, WalletContract, [], {gasLimit: 5000000});

    await walletContract.initializeWithENS(keyPair.publicKey, ...ensArgs, TEST_GAS_PRICE, ETHER_NATIVE_TOKEN.address);
    expect(utils.formatEther(await provider.getBalance(walletContract.address))).to.eq('0.999999999999316');
  });

  it('refund after initialize', async () => {
    const walletContract = await deployContract(wallet, WalletContract, [], {gasLimit: 5000000});

    await walletContract.initialize(keyPair.publicKey, TEST_GAS_PRICE, ETHER_NATIVE_TOKEN.address);
    expect(utils.formatEther(await provider.getBalance(walletContract.address))).to.eq('0.999999999999316');
  });

  it('can`t initialize wallet twice', async () => {
    const walletContract = await deployContract(wallet, WalletContract, [], {gasLimit: 5000000});
    await walletContract.initializeWithENS(keyPair.publicKey, ...ensArgs, '0', ETHER_NATIVE_TOKEN.address);
    await expect(walletContract.initializeWithENS(keyPair.publicKey, ...ensArgs, '0', ETHER_NATIVE_TOKEN.address)).to.be.revertedWith('Contract instance has already been initialized');
  });
});
