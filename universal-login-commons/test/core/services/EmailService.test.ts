import {fetch, sleep, http} from '../../../src';
import nodemailer from 'nodemailer';
import {EmailService} from '../../../src/core/services/EmailService';
import {MailOptions} from 'nodemailer/lib/json-transport';
import {expect} from 'chai';

const mailtrapApiToken = '03d3f8053c437653b11498a432030d0e';
const inboxId = '981903';

describe('INT: EmailService', async () => {
  const _http = http(fetch)('https://mailtrap.io/api/v1');
  const emailService = new EmailService('mockedPassword');
  (emailService as any).transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '49c1f158b8636e',
      pass: 'e80bb09c2323d5',
    },
  });

  xit('Should send email and receive it', async () => {
    _http('PATCH', `/inboxes/${inboxId}/clean?api_token=${mailtrapApiToken}`);
    const mailSubject = `EmailService test #${Math.random()}`;
    const mailOptions = {
      from: '"Example Mail" <test@unilogin.io>',
      to: 'user1@example.com',
      subject: mailSubject,
      text: 'It’s our test message',
      html: '<b>Hey there! </b><br> It’s our test message',
    } as MailOptions;

    emailService.sendMail(mailOptions);
    await sleep(3000);

    const messages = await (await fetch(`https://mailtrap.io/api/v1/inboxes/${inboxId}/messages?api_token=${mailtrapApiToken}`)).json();
    expect(messages[0].subject).be.deep.eq(mailSubject);
  });

  xit('Send confirmation email', () => {
    const normalEmailService = new EmailService('Password');
    normalEmailService.sendConfirmationMail('szymon@ethworks.io', '123456');
  });
});
