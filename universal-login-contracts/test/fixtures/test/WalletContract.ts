import {expect} from 'chai';
import {Contract, Wallet, utils, providers} from 'ethers';
import {loadFixture} from 'ethereum-waffle';
import {walletContractFixture} from '../../fixtures/walletContract';
import WalletMaster from '../../../build/WalletMasterWithRefund.json';
import {KeyPair, MANAGEMENT_KEY} from '@universal-login/commons';


describe('WalletContract fixture test', () => {
  let walletContract: Contract;
  let keyPair: KeyPair;
  let deployer: Wallet;
  let provider: providers.Provider;

  before(async () => {
    ({walletContract, deployer, keyPair, provider} = await loadFixture(walletContractFixture));
  });

  it('should deploy wallet contract', () => {
    expect(walletContract).to.not.be.null;
  });

  it('walletOwner address should be managament key', async () => {
    const getKeyPurposeInterface = new utils.Interface(WalletMaster.interface).functions.getKeyPurpose;
    const getKeyPurposeData = getKeyPurposeInterface.encode([keyPair.publicKey]);
    const callTransaction = {to: walletContract.address, data: getKeyPurposeData};
    const resultCall = await deployer.provider.call(callTransaction);
    expect(getKeyPurposeInterface.decode(resultCall).purpose).to.eq(MANAGEMENT_KEY);
  });

  it('has proper ens name', async () => {
    const defaultEnsName = 'name.mylogin.eth';
    expect(await provider.resolveName(defaultEnsName)).to.eq(walletContract.address);
    expect(await provider.lookupAddress(walletContract.address)).to.eq(defaultEnsName);
  });
});
