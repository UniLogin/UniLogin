import {expect} from 'chai';
import {Contract, providers, Wallet} from 'ethers';
import {loadFixture} from 'ethereum-waffle';
import {walletContractFixture} from '../../fixtures/walletContract';
import {KeyPair} from '@unilogin/commons';
import {WalletContractInterface} from '../../helpers/interfaces';

describe('WalletContract fixture test', () => {
  let proxyWallet: Contract;
  let keyPair: KeyPair;
  let deployer: Wallet;
  let providerWithENS: providers.Provider;

  before(async () => {
    ({proxyWallet, deployer, keyPair, providerWithENS} = await loadFixture(walletContractFixture));
  });

  it('should deploy wallet contract', () => {
    expect(proxyWallet).to.not.be.null;
  });

  it('walletOwner address should be managament key', async () => {
    const keyExistInterface = WalletContractInterface.functions.keyExist;
    const keyExistData = keyExistInterface.encode([keyPair.publicKey]);
    const callTransaction = {to: proxyWallet.address, data: keyExistData};
    const resultCall = await deployer.provider.call(callTransaction);
    expect(keyExistInterface.decode(resultCall)[0]).to.be.true;
  });

  it('has proper ens name', async () => {
    const defaultEnsName = 'name.mylogin.eth';
    expect(await providerWithENS.resolveName(defaultEnsName)).to.eq(proxyWallet.address);
    expect(await providerWithENS.lookupAddress(proxyWallet.address)).to.eq(defaultEnsName);
  });
});
