import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import {EmailConfirmationValidator} from '../../../../src/core/services/validators/EmailConfirmationValidator';
import {EmailConfirmationsStore} from '../../../../src/integration/sql/services/EmailConfirmationsStore';

chai.use(chaiAsPromised);

describe('UNIT: EmailConfirmationValidator', () => {
  let validator: EmailConfirmationValidator;
  const duplicatedEmail = 'test@unilogin.test';
  const email = 'account@unilogin.test';
  const expiredMail = 'expiredMail@unilogin.test';
  const date = new Date();
  const code = '012345';
  const codeDuration = 5;

  before(() => {
    const emailConfirmationServiceStub = sinon.createStubInstance(EmailConfirmationsStore);

    const confirmedEmailConfirmation = {
      email: duplicatedEmail,
      code,
      ensName: 'account.unilogin.test',
      createdAt: date,
      isConfirmed: true,
    };
    const emailConfirmation = {
      email: email,
      code,
      ensName: 'account.unilogin.test',
      createdAt: date,
      isConfirmed: false,
    };
    const expiredEmailConfirmation = {
      email: expiredMail,
      code,
      ensName: 'account.unilogin.test',
      createdAt: new Date('2020-07-09T13:00:00.000Z'),
      isConfirmed: false,
    };
    emailConfirmationServiceStub.get.withArgs(duplicatedEmail).resolves(confirmedEmailConfirmation);
    emailConfirmationServiceStub.get.withArgs(email).resolves(emailConfirmation);
    emailConfirmationServiceStub.get.withArgs(expiredMail).resolves(expiredEmailConfirmation);

    validator = new EmailConfirmationValidator(emailConfirmationServiceStub as any, codeDuration);
  });

  it('email is confirmed', async () => {
    await expect(validator.validate(duplicatedEmail, code)).to.be.rejectedWith('Email already used: test@unilogin.test');
  });

  it('email is not confirmed validate fails', async () => {
    await expect(validator.validate(email, code)).to.be.fulfilled;
  });

  it('email is not request confirmation', async () => {
    await expect(validator.validate('not-existed@unilogin.test', code)).to.be.rejectedWith('Email confirmation is not requested for not-existed@unilogin.test');
  });

  it('code is wrong', async () => {
    await expect(validator.validate(email, '123456')).to.be.rejectedWith('Invalid code: 123456');
  });

  it('Code expired', async () => {
    await expect(validator.validate(expiredMail, code)).to.be.rejectedWith('Code expired');
    (validator as any).codeDurationInMinutes = 60 * 24 * 5;
    await expect(validator.validate(expiredMail, code)).to.be.fulfilled;
  });
});
