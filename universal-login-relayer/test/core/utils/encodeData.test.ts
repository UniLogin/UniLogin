import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {createMockProvider, getWallets, solidity} from 'ethereum-waffle';
import {
  decodeParametersFromData,
  getFunctionParametersData,
  isAddKeyCall,
  isAddKeysCall,
} from '../../../src/core/utils/encodeData';
import {Wallet} from 'ethers';
import {WalletContractInterface} from '@universal-login/contracts';

chai.use(chaiAsPromised);
chai.use(solidity);

describe('INT: Core tools test', async () => {
  let provider;
  let wallet: Wallet;
  let otherWallet: Wallet;

  before(async () => {
    provider = createMockProvider();
    [wallet, otherWallet] = getWallets(provider);
  });

  describe('getFunctionParametersData', () => {
    it('no params', () => {
      const input = '0x5f7b68be';
      const output = '0x';
      expect(getFunctionParametersData(input)).to.eq(output);
    });

    it('simple params', () => {
      const input = '0x5f7b68be00000000000000000000000017ec8597ff92c3f44523bdc65bf0f1be632917ff';
      const output = '0x00000000000000000000000017ec8597ff92c3f44523bdc65bf0f1be632917ff';
      expect(getFunctionParametersData(input)).to.eq(output);
    });

    it('tricky params', () => {
      const input = '0x5f7b68be5f7b68be';
      const output = '0x5f7b68be';
      expect(getFunctionParametersData(input)).to.eq(output);
    });

    it('throw error', () => {
      const input = '000000';
      expect(() => getFunctionParametersData(input)).to.throw(`Invalid hex data: ${input}`);
    });
  });

  describe('decodeParametersFromData', async () => {
    it('Should return proper key for addKey', async () => {
      const data = WalletContractInterface.functions.addKey.encode([wallet.address]);
      expect(decodeParametersFromData(data, ['address'])[0]).to.eq(wallet.address);
    });

    it('Should return proper key for removeKey', async () => {
      const data = WalletContractInterface.functions.removeKey.encode([wallet.address]);
      expect(decodeParametersFromData(data, ['address'])[0]).to.eq(wallet.address);
    });

    it('Should return proper key for addKeys', async () => {
      const keys = [wallet.address];
      const data = WalletContractInterface.functions.addKeys.encode([keys]);
      expect(decodeParametersFromData(data, ['address[]'])[0]).to.deep.eq(keys);
    });
  });

  describe('isAddKeyCall', async () => {
    it('Should return true if addKey call', async () => {
      const data = WalletContractInterface.functions.addKey.encode([wallet.address]);
      expect(isAddKeyCall(data)).to.be.true;
    });

    it('Should return false if no addKey call', async () => {
      const data = WalletContractInterface.functions.removeKey.encode([wallet.address]);
      expect(isAddKeyCall(data)).to.be.false;
    });
  });

  describe('isAddKeysCall', async () => {
    it('Should return true if addKeys call', async () => {
      const keys = [wallet.address, otherWallet.address];
      const data = WalletContractInterface.functions.addKeys.encode([keys]);
      expect(isAddKeysCall(data)).to.be.true;
    });

    it('Should return false if no addKeys call', async () => {
      const data = WalletContractInterface.functions.removeKey.encode([wallet.address]);
      expect(isAddKeysCall(data)).to.be.false;
    });
  });
});
