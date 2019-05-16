import {expect} from 'chai';
import {Contract, Wallet, utils, providers} from 'ethers';
import {loadFixture} from 'ethereum-waffle';
import {walletContract as walletContractFixture} from '../../fixtures/walletContract';
import WalletMaster from '../../../build/WalletMaster.json';
import {MANAGEMENT_KEY} from '../../../lib';


describe('WalletContract fixture test', () => {
  let walletContract: Contract;
  let walletOwner: Wallet;
  let wallet: Wallet;
  let provider: providers.Provider;

  before(async () => {
    ({walletContract, walletOwner, wallet, provider} = await loadFixture(walletContractFixture));
  });

  it('should deploy wallet contract', () => {
    expect(walletContract).to.not.be.null;
  });

  it('walletOwner address should be managament key', async () => {
    const getKeyPurposeInterface = new utils.Interface(WalletMaster.interface).functions.getKeyPurpose;
    const getKeyPurposeData = getKeyPurposeInterface.encode([walletOwner.address]);
    const callTransaction = {to: walletContract.address, data: getKeyPurposeData};
    const resultCall = await wallet.provider.call(callTransaction);
    expect(getKeyPurposeInterface.decode(resultCall).purpose).to.eq(MANAGEMENT_KEY);
  });

  it('has proper ens name', async () => {
    const defaultEnsName = 'name.mylogin.eth';
    expect(await provider.resolveName(defaultEnsName)).to.eq(walletContract.address);
    expect(await provider.lookupAddress(walletContract.address)).to.eq(defaultEnsName);
  });
});