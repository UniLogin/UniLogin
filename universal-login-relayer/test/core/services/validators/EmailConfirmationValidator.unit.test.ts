import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import {EmailConfirmationValidator as EmailConfirmationValidator} from '../../../../src/core/services/validators/EmailConfirmationValidator';
import {EmailConfirmationsStore} from '../../../../src/integration/sql/services/EmailConfirmationsStore';

chai.use(chaiAsPromised);

describe('UNIT: EmailConfirmationValidator', () => {
  let validator: EmailConfirmationValidator;
  const email1 = 'test@unilogin.test';
  const email2 = 'account@unilogin.test';

  before(() => {
    const emailConfirmationServiceStub = sinon.createStubInstance(EmailConfirmationsStore);
    const emailConfirmation1 = {
      email: email1,
      ensName: 'account.unilogin.test',
      code: '012345',
      createdAt: new Date(),
      isConfirmed: true,
    };
    const emailConfirmation2 = {
      email: email2,
      ensName: 'account.unilogin.test',
      code: '012345',
      createdAt: new Date(),
      isConfirmed: false,
    };
    emailConfirmationServiceStub.get.withArgs(email1).resolves(emailConfirmation1);
    emailConfirmationServiceStub.get.withArgs(email2).resolves(emailConfirmation2);

    validator = new EmailConfirmationValidator(emailConfirmationServiceStub as any);
  });

  it('fails because email is confirmed', async () => {
    await expect(validator.validate(email1)).to.be.rejectedWith('Email already is used: test@unilogin.test');
  });

  it('fulfilled because email is not confirmed validate fails', async () => {
    await expect(validator.validate(email2)).to.be.fulfilled;
  });

  it('fails because email is not request confirmation', async () => {
    await expect(validator.validate('not-existed@unilogin.test')).to.be.rejectedWith('Email confirmation is not requested for not-existed@unilogin.test');
  });
});
