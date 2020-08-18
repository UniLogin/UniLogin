import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {EmailConfirmationValidator} from '../../../../src/core/services/validators/EmailConfirmationValidator';
import {createTestEmailConfirmation} from '../../../testhelpers/createTestEmailConfirmation';
import {getDateMinutesAgo} from '../../../testhelpers/getDateMinutesAgo';

chai.use(chaiAsPromised);

describe('UNIT: EmailConfirmationValidator', () => {
  let validator: EmailConfirmationValidator;
  const codeDuration = 5;

  const emailConfirmation = createTestEmailConfirmation({});
  const {email, code} = emailConfirmation;

  before(() => {
    validator = new EmailConfirmationValidator(codeDuration);
  });

  it('email is confirmed', async () => {
    const confirmedEmailConfirmation = {...emailConfirmation, isConfirmed: true};
    expect(() => validator.validate(confirmedEmailConfirmation, email, code)).throws('Unexpected confirmation from email: account@unilogin.test');
  });

  it('email is not confirmed validate fails', async () => {
    expect(validator.validate(emailConfirmation, email, code)).not.throws;
  });

  it('code is wrong', async () => {
    expect(() => validator.validate(emailConfirmation, email, '123456')).throws('Invalid code: 123456');
  });

  it('code expiration', async () => {
    const createdAt = getDateMinutesAgo(codeDuration);
    const expiredEmailConfirmation = {...emailConfirmation, createdAt};
    expect(() => validator.validate(expiredEmailConfirmation, email, code)).throws('Code expired');
    (validator as any).codeExpirationTimeInMinutes = 60 * 24 * 5;
    expect(validator.validate(expiredEmailConfirmation, email, code)).not.throws;
  });
});
