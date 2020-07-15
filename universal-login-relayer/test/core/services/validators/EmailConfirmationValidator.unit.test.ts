import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {EmailConfirmationValidator} from '../../../../src/core/services/validators/EmailConfirmationValidator';
import {createTestEmailConfirmation} from '../../../testhelpers/createTestEmailConfirmation';

chai.use(chaiAsPromised);

describe('UNIT: EmailConfirmationValidator', () => {
  let validator: EmailConfirmationValidator;
  const codeDuration = 5;

  const emailConfirmation = createTestEmailConfirmation();
  const {email, code} = emailConfirmation;

  before(() => {
    validator = new EmailConfirmationValidator(codeDuration);
  });

  it('email is confirmed', async () => {
    const confirmedEmailConfirmation = {...emailConfirmation, isConfirmed: true};
    expect(() => validator.validate(confirmedEmailConfirmation, email, code)).throws('Email already used: account@unilogin.test');
  });

  it('email is not confirmed validate fails', async () => {
    expect(validator.validate(emailConfirmation, email, code)).not.throws;
  });

  it('code is wrong', async () => {
    expect(() => validator.validate(emailConfirmation, email, '123456')).throws('Invalid code: 123456');
  });

  it('Code expired', async () => {
    const expiredEmailConfirmation = {...emailConfirmation, createdAt: new Date('2020-07-09T13:00:00.000Z')};
    expect(() => validator.validate(expiredEmailConfirmation, email, code)).throws('Code expired');
    (validator as any).codeDurationInMinutes = 60 * 24 * 1000;
    expect(validator.validate(expiredEmailConfirmation, email, code)).not.throws;
  });
});
