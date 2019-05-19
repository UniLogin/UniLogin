import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {createMockProvider, getWallets, solidity} from 'ethereum-waffle';
import {getKeyFromData, isAddKeyCall, isAddKeysCall} from '../../lib/utils/utils';
import {utils} from 'ethers';
import {MANAGEMENT_KEY, ACTION_KEY} from '@universal-login/contracts';
import WalletContract from '@universal-login/contracts/build/WalletMaster.json';

chai.use(chaiAsPromised);
chai.use(solidity);

describe('Tools test', async () => {
  let provider;
  let wallet;
  let otherWallet;

  before(async () => {
    provider = createMockProvider();
    [wallet, otherWallet] = await getWallets(provider);
  });

  describe('getKeyFromData', async () => {
    it('Should return proper key', async () => {
      const data = new utils.Interface(WalletContract.interface).functions.addKey.encode([wallet.address, ACTION_KEY]);
      expect(getKeyFromData(data)).to.eq(wallet.address.toLowerCase()); // OK?
    });
  });

  describe('isAddKeyCall', async () => {
    it('Should return true if addKey call', async () => {
      const data = new utils.Interface(WalletContract.interface).functions.addKey.encode([wallet.address, ACTION_KEY]);
      expect(isAddKeyCall(data)).to.be.true;
    });

    it('Should return false if no addKey call', async () => {
      const data = new utils.Interface(WalletContract.interface).functions.removeKey.encode([wallet.address, ACTION_KEY]);
      expect(isAddKeyCall(data)).to.be.false;
    });
  });

  describe('isAddKeysCall', async () => {
    it('Should return true if addKeys call', async () => {
      const keys = [wallet.address, otherWallet.address];
      const keyRoles = new Array(keys.length).fill(MANAGEMENT_KEY);
      const data = new utils.Interface(WalletContract.interface).functions.addKeys.encode([keys, keyRoles]);
      expect(isAddKeysCall(data)).to.be.true;
    });

    it('Should return false if no addKeys call', async () => {
      const data = new utils.Interface(WalletContract.interface).functions.removeKey.encode([wallet.address, ACTION_KEY]);
      expect(isAddKeysCall(data)).to.be.false;
    });
  });
});
