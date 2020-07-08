import {EmailService} from '../../../src/core/services/EmailService';
import {expect} from 'chai';

describe('INT: EmailService', async () => {
  xit('Send confirmation email', async () => {
    const emailService = new EmailService('testowyunilogin@gmail.com', 'password');
    const sentMailInfo = await emailService.sendConfirmationMail('testowyunilogin@gmail.com', '123456');
    expect(sentMailInfo.accepted[0]).be.deep.eq('testowyunilogin@gmail.com');
  });
});
