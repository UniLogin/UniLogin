import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {createMockProvider, getWallets, solidity} from 'ethereum-waffle';
import {getKeyFromData, isAddKeyCall, isAddKeysCall} from '../../../../../lib/core/utils/utils';
import {utils} from 'ethers';
import WalletContract from '@universal-login/contracts/build/Wallet.json';
import {MANAGEMENT_KEY} from '@universal-login/commons';

chai.use(chaiAsPromised);
chai.use(solidity);

describe('INT: Core tools test', async () => {
  let provider;
  let wallet;
  let otherWallet;

  before(async () => {
    provider = createMockProvider();
    [wallet, otherWallet] = await getWallets(provider);
  });

  describe('getKeyFromData', async () => {
    it('Should return proper key', async () => {
      const data = new utils.Interface(WalletContract.interface).functions.addKey.encode([wallet.address]);
      expect(getKeyFromData(data)).to.eq(wallet.address); // OK?
    });
  });

  describe('isAddKeyCall', async () => {
    it('Should return true if addKey call', async () => {
      const data = new utils.Interface(WalletContract.interface).functions.addKey.encode([wallet.address]);
      expect(isAddKeyCall(data)).to.be.true;
    });

    it('Should return false if no addKey call', async () => {
      const data = new utils.Interface(WalletContract.interface).functions.removeKey.encode([wallet.address]);
      expect(isAddKeyCall(data)).to.be.false;
    });
  });

  describe('isAddKeysCall', async () => {
    it('Should return true if addKeys call', async () => {
      const keys = [wallet.address, otherWallet.address];
      const data = new utils.Interface(WalletContract.interface).functions.addKeys.encode([keys]);
      expect(isAddKeysCall(data)).to.be.true;
    });

    it('Should return false if no addKeys call', async () => {
      const data = new utils.Interface(WalletContract.interface).functions.removeKey.encode([wallet.address]);
      expect(isAddKeysCall(data)).to.be.false;
    });
  });
});
