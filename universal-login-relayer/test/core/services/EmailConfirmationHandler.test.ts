import {expect} from 'chai';
import sinon from 'sinon';
import {EmailConfirmationHandler, generateValidationCode} from '../../../src/core/services/EmailConfirmationHandler';
import {EmailConfirmationsStore} from '../../../src/integration/sql/services/EmailConfirmationsStore';
import {EmailService} from '../../../src/integration/ethereum/EmailService';

describe('UNIT: EmailConfirmationHandler', () => {
  let emailConfirmationStoreStub: sinon.SinonStubbedInstance<EmailConfirmationsStore>;
  let emailServiceStub: sinon.SinonStubbedInstance<EmailService>;
  let emailConfirmationHandler: EmailConfirmationHandler;

  before(() => {
    emailConfirmationStoreStub = sinon.createStubInstance(EmailConfirmationsStore);
    emailServiceStub = sinon.createStubInstance(EmailService);
    emailConfirmationHandler = new EmailConfirmationHandler(emailConfirmationStoreStub as any, emailServiceStub as any);
  });

  it('generateValidationCode', () => {
    const code = generateValidationCode(6);
    expect(code).to.be.a('string');
    expect(code).length(6);
    for (const sign of code) {
      expect('0123456789').contain(sign);
    }
  });

  it('should handle email request', async () => {
    const email = 'hello@unilogin.io';
    const ensName = 'hello.unilogin.eth';

    await emailConfirmationHandler.request(email, ensName);

    expect(emailConfirmationStoreStub.add.calledOnce);

    const {code, createdAt, ...addArgs} = emailConfirmationStoreStub.add.firstCall.lastArg;

    expect(addArgs).deep.eq({email, ensName, isConfirmed: false});
    expect(code).to.be.a('string').length(6);
    expect(createdAt).to.be.a('date').below(new Date());

    expect(emailServiceStub.sendConfirmationMail).calledOnceWithExactly(email, code);
  });
});
