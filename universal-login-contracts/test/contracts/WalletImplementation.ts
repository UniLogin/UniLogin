import {expect} from 'chai';
import {loadFixture, deployContract, getWallets} from 'ethereum-waffle';
import {basicENS} from '@universal-login/commons/testutils';
import {utils, Wallet, providers} from 'ethers';
import WalletMaster from '../../build/Wallet.json';
import {createKeyPair} from '@universal-login/commons';

const computeContractAddress = (address: string, nonce: number) => {
  const futureAddress = utils.solidityKeccak256(['bytes1', 'bytes1', 'address', 'bytes1'], ['0xd6', '0x94', address, utils.hexlify(nonce)]);
  return utils.getAddress(`0x${futureAddress.slice(26)}`);
};

describe('WalletImplementation', () => {
  let provider: providers.Provider;
  let publicResolver;
  let registrarAddress;
  let ensAddress;
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
  });

  it('wallet implementation deployed and initialized successfully', async () => {
    const transactionCount = await wallet.getTransactionCount();
    const futureAddress = computeContractAddress(wallet.address, transactionCount);
    await otherWallet.sendTransaction({to: futureAddress, value: utils.parseEther('1')});
    const walletContract = await deployContract(wallet, WalletMaster, [], {gasLimit: 5000000});

    await walletContract.initializeWithENS(keyPair.publicKey, ...ensArgs, '1');
    expect(utils.formatEther(await provider.getBalance(walletContract.address))).to.eq('0.9999999999995');
  });

  it('can`t initialize wallet twice', async () => {
    const walletContract = await deployContract(wallet, WalletMaster, [], {gasLimit: 5000000});
    await walletContract.initializeWithENS(keyPair.publicKey, ...ensArgs, '0');
    await expect(walletContract.initializeWithENS(keyPair.publicKey, ...ensArgs, '0')).to.be.revertedWith('Contract instance has already been initialized');
  });
});
