import chai, {expect} from 'chai';
import sinon, {StubbableType} from 'sinon';
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
    let setErrors: () => void;
    let onDeleteAccountClick: sinon.SinonStub;

    beforeEach(() => {
      sdk = {
        stop: sinon.stub(),
        removeKey: sinon.stub()
      } as unknown as UniversalLoginSDK;
      deployedWallet = new DeployedWallet('0x123', 'test.test.eth', '0x29F3EDEE0AD3ABF8E2699402E0E28CD6492C9BE7EAAB00D732A791C33552F779', sdk);
      setErrors = sinon.stub();
      onDeleteAccountClick = sinon.stub();
    });

    it('delete account if inputs are valid', async () => {
      await deleteAccount(deployedWallet, {username: 'test.test.eth', verifyField: 'DELETE MY ACCOUNT'}, setErrors, onDeleteAccountClick);
      expect(setErrors).to.be.calledOnce;
      expect(sdk.stop).to.be.calledOnce;
      expect(sdk.removeKey).to.be.calledOnce;
      expect(onDeleteAccountClick).to.be.calledOnce;
    });

    it('dont delete account if inputs are invalid', async() => {
      await deleteAccount(deployedWallet, {username: 'test', verifyField: 'DELETE MY ACCOUNT'}, setErrors, onDeleteAccountClick);
      expect(setErrors).to.be.calledOnce;
      expect(sdk.stop).to.not.be.called;
      expect(sdk.removeKey).to.not.be.called;
      expect(onDeleteAccountClick).to.not.be.called;
    });
  });
});
