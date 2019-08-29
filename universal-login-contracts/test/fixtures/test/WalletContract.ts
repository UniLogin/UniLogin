import {expect} from 'chai';
import {Contract, Wallet, utils, providers} from 'ethers';
import {loadFixture} from 'ethereum-waffle';
import {walletContractFixture} from '../../fixtures/walletContract';
import WalletContract from '../../../build/Wallet.json';
import {KeyPair, MANAGEMENT_KEY} from '@universal-login/commons';


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
    const getKeyPurposeInterface = new utils.Interface(WalletContract.interface).functions.getKeyPurpose;
    const getKeyPurposeData = getKeyPurposeInterface.encode([keyPair.publicKey]);
    const callTransaction = {to: proxyWallet.address, data: getKeyPurposeData};
    const resultCall = await deployer.provider.call(callTransaction);
    expect(getKeyPurposeInterface.decode(resultCall).purpose).to.eq(MANAGEMENT_KEY);
  });

  it('has proper ens name', async () => {
    const defaultEnsName = 'name.mylogin.eth';
    expect(await provider.resolveName(defaultEnsName)).to.eq(proxyWallet.address);
    expect(await provider.lookupAddress(proxyWallet.address)).to.eq(defaultEnsName);
  });
});
