import nodemailer from 'nodemailer';
import {MailOptions} from 'nodemailer/lib/json-transport';
import {CannotSendEmail} from '../..';
import Mail from 'nodemailer/lib/mailer';

export class EmailService {
  private transporter: Mail;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'testowyunilogin@gmail.com',
        pass: 'password :)',
      },
    });
  }

  sendMail(mailOptions: MailOptions) {
    this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        throw new CannotSendEmail(error.message);
      }
    });
  }

  async sendConfirmationMail(email: string, code: string) {
    const mailOptions = {
      from: 'UniLogin <noreply.confirmation@unilogin.io>',
      to: email,
      subject: 'Confirm your email address',
      text: `Hey there, here is your confrimation code: ${code}`,
      html: `<b>Hey there!</b><br><br>

      Here is your confirmation code: ${code}<br>
      <button>Copy</button>`,
      replyTo: 'noreply.confirmation@unilogin.io',
    };
    this.sendMail(mailOptions);
  }
}
