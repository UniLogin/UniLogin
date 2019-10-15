import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {validateVerifyField, deleteAccount} from '../../../src/core/services/DeleteAccountService';
import UniversalLoginSDK, {DeployedWallet} from '@universal-login/sdk';

chai.use(sinonChai);

describe('DeleteAccountService', () => {

  describe('validateVerifyField', () => {
    it('return true if username valid', () => {
      expect(validateVerifyField('DELETE MY ACCOUNT')).to.be.true;
    });

    it('return false if username invalid', () => {
      expect(validateVerifyField('test')).to.be.false;
    });
  });

  describe('deleteAccount', () => {
    let sdk: UniversalLoginSDK;
    let deployedWallet: DeployedWallet;

    before(() => {
      sdk = {
        stop: sinon.stub(),
        removeKey: sinon.stub()
      } as unknown as UniversalLoginSDK;
      deployedWallet = new DeployedWallet('0x123', 'test.test.eth', '0x29F3EDEE0AD3ABF8E2699402E0E28CD6492C9BE7EAAB00D732A791C33552F779', sdk);
    });

    it('stop sdk and remove key', async () => {
      await deleteAccount(deployedWallet, () => {}, 'test', 'DELETE MY ACCOUNT');
      expect(sdk.stop).to.be.calledOnce;
      expect(sdk.removeKey).to.be.calledOnce;
    });
  });
});
