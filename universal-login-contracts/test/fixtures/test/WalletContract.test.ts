import {expect} from 'chai';
import {Contract, providers, Wallet} from 'ethers';
import {loadFixture} from 'ethereum-waffle';
import {walletContractFixture} from '../../fixtures/walletContract';
import {KeyPair} from '@universal-login/commons';
import {WalletContractInterface} from '../../../src/interfaces';

describe('WalletContract fixture test', () => {
  let proxyWallet: Contract;
  let keyPair: KeyPair;
  let deployer: Wallet;
  let provider: providers.Provider;

  before(async () => {
    ({proxyWallet, deployer, keyPair, provider} = await loadFixture(walletContractFixture));
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
    expect(await provider.resolveName(defaultEnsName)).to.eq(proxyWallet.address);
    expect(await provider.lookupAddress(proxyWallet.address)).to.eq(defaultEnsName);
  });
});
