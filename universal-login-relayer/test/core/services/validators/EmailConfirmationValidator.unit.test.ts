import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {EmailConfirmationValidator} from '../../../../src/core/services/validators/EmailConfirmationValidator';

chai.use(chaiAsPromised);

describe('UNIT: EmailConfirmationValidator', () => {
  let validator: EmailConfirmationValidator;
  const email = 'account@unilogin.test';
  const expiredMail = 'expiredMail@unilogin.test';
  const date = new Date();
  const code = '012345';
  const codeDuration = 5;

  const emailConfirmation = {
    email: email,
    code,
    ensName: 'account.unilogin.test',
    createdAt: date,
    isConfirmed: false,
  };

  before(() => {
    validator = new EmailConfirmationValidator(codeDuration);
  });

  it('email is confirmed', async () => {
    const confirmedEmailConfirmation = {...emailConfirmation, isConfirmed: true};
    await expect(validator.validate(confirmedEmailConfirmation, email, code)).to.be.rejectedWith('Email already used: account@unilogin.test');
  });

  it('email is not confirmed validate fails', async () => {
    await expect(validator.validate(emailConfirmation, email, code)).to.be.fulfilled;
  });

  it('code is wrong', async () => {
    await expect(validator.validate(emailConfirmation, email, '123456')).to.be.rejectedWith('Invalid code: 123456');
  });

  it('Code expired', async () => {
    const expiredEmailConfirmation = {...emailConfirmation, createdAt: new Date('2020-07-09T13:00:00.000Z')};
    await expect(validator.validate(expiredEmailConfirmation, expiredMail, code)).to.be.rejectedWith('Code expired');
    (validator as any).codeDurationInMinutes = 60 * 24 * 5;
    await expect(validator.validate(expiredEmailConfirmation, expiredMail, code)).to.be.fulfilled;
  });
});
