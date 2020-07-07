import nodemailer from 'nodemailer';
import {MailOptions} from 'nodemailer/lib/json-transport';
import {CannotSendEmail} from '../..';
import Mail from 'nodemailer/lib/mailer';

export class EmailService {
  private transporter: Mail;
  constructor(transporterEmail: string, transporterEmailPassword: string) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: transporterEmail,
        pass: transporterEmailPassword,
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
      subject: 'Email Confirmation',
      text: `To make sure your UniLogin account is safe and secure,
      we ask you to authenticate your email address by copying the code below and pasting it in UniLogin.
      Here is your confrimation code: ${code}`,
      html: `
      <html>
      <head>
        <style>
          .confirmationCode {
            position: absolute;
            top: 50%;
            left: 50%;
            font-size: 20px;
          }
          body {
            position: relative;
            width: 600px;
            height: 1021px;
            background-image: url('../../../confirmationMail.png');
          }
        </style>
      </head>
      <body>
        <b>Hey there!</b><br><br>

        <div class='confirmationCode'>${code}</div><br>
        <button>Copy</button>
      </body>
      </html>
      `,
      replyTo: 'noreply.confirmation@unilogin.io',
    };
    this.sendMail(mailOptions);
  }
}
