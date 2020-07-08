import {EmailService} from '../../../src/core/services/EmailService';
import {expect} from 'chai';

describe('INT: EmailService', async () => {
  it('Send confirmation email', async () => {
    const emailService = new EmailService('testowyunilogin@gmail.com', 'ILikeToTestUnilogin');
    const recipientMail = 'testowyunilogin@gmail.com';
    const sentMailInfo = await emailService.sendConfirmationMail(recipientMail, '123456');
    expect(sentMailInfo.accepted[0]).be.deep.eq(recipientMail);
  });
});
