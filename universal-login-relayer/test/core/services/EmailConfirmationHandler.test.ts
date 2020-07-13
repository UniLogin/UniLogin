import {expect} from 'chai';
import sinon from 'sinon';
import {EmailConfirmationHandler, generateValidationCode} from '../../../src/core/services/EmailConfirmationHandler';
import {EmailConfirmationsStore} from '../../../src/integration/sql/services/EmailConfirmationsStore';
import {EmailService} from '../../../src/integration/ethereum/EmailService';
import {EmailConfirmationValidator} from '../../../src/core/services/validators/EmailConfirmationValidator';
import {InvalidCode} from '../../../src/core/utils/errors';
import {createTestEmailConfirmation} from '../../testhelpers/createTestEmailConfirmation';

describe('UNIT: EmailConfirmationHandler', () => {
  let emailConfirmationStoreStub: sinon.SinonStubbedInstance<EmailConfirmationsStore>;
  let emailServiceStub: sinon.SinonStubbedInstance<EmailService>;
  let emailConfirmationValidatorStub: sinon.SinonStubbedInstance<EmailConfirmationValidator>;
  let emailConfirmationHandler: EmailConfirmationHandler;

  const emailConfirmation = createTestEmailConfirmation();
  const invalidCode = '123456';
  const {email, code} = emailConfirmation;

  before(() => {
    emailConfirmationStoreStub = sinon.createStubInstance(EmailConfirmationsStore);
    emailConfirmationStoreStub.get.resolves(emailConfirmation);

    emailServiceStub = sinon.createStubInstance(EmailService);

    emailConfirmationValidatorStub = sinon.createStubInstance(EmailConfirmationValidator);

    emailConfirmationValidatorStub.validate.throws(new InvalidCode(invalidCode)).withArgs(emailConfirmation, emailConfirmation.email, emailConfirmation.code).resolves();
    emailConfirmationHandler = new EmailConfirmationHandler(emailConfirmationStoreStub as any, emailServiceStub as any, emailConfirmationValidatorStub as any);
  });

  it('generateValidationCode', () => {
    const code = generateValidationCode(6);
    expect(code).to.be.a('string');
    expect(code).length(6);
    for (const sign of code) {
      expect('0123456789').contain(sign);
    }
  });

  it('request', async () => {
    const ensName = 'hello.unilogin.eth';

    const result = await emailConfirmationHandler.request(email, ensName);
    expect(result).eq(email);
    expect(emailConfirmationStoreStub.add.calledOnce);

    const {code, createdAt, ...addArgs} = emailConfirmationStoreStub.add.firstCall.lastArg;

    expect(addArgs).deep.eq({email, ensName, isConfirmed: false});
    expect(code).to.be.a('string').length(6);
    expect(createdAt).to.be.a('date').below(new Date());

    expect(emailServiceStub.sendConfirmationMail).calledOnceWithExactly(email, code);
  });

  describe('confirm', () => {
    it('valid email confirmation', async () => {
      await expect(emailConfirmationHandler.confirm(email, code)).to.be.fulfilled;
      expect(emailConfirmationStoreStub.get).calledOnceWithExactly(email);
      expect(emailConfirmationValidatorStub.validate).calledOnceWithExactly(emailConfirmation, email, code);
      expect(emailConfirmationStoreStub.updateIsConfirmed).calledOnceWithExactly(emailConfirmation, true);
    });

    it('valid email confirmation', async () => {
      await expect(emailConfirmationHandler.confirm(email, invalidCode)).rejectedWith(`Invalid code: ${invalidCode}`);
    });
  });
});
