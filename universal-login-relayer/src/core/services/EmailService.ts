import nodemailer, {SentMessageInfo} from 'nodemailer';
import {MailOptions} from 'nodemailer/lib/json-transport';
import Mail from 'nodemailer/lib/mailer';
import {CannotSendEmail} from '@unilogin/commons';

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

  async sendMail(mailOptions: MailOptions): Promise<SentMessageInfo> {
    try{
      return await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw new CannotSendEmail(error.message);
    }
  }

  async sendConfirmationMail(email: string, code: string): Promise<SentMessageInfo> {
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
            font-size: 15px;
          }
          .email {
            position: relative;
            width: 600px;
            height: 1021px;
            background: #fff
          }
          a {
            background-color: #0E1F98;
            box-shadow: 0 5px 0 darkred;
            padding: 1em 1.5em;
            position: relative;
            text-decoration: none;
            text-transform: uppercase;
            border-radius: 3px;
          }

          a:hover {
            cursor: pointer;
          }

          a:active {
            box-shadow: none;
            top: 5px;
          }
        </style>
      </head>
      <body>
        <div class='email'>
        <h1>Email Confirmation</h1><br>
        <div class='confirmationCode'>
          To make sure your UniLogin account is safe and secure, we ask you to authenticate your email address by copying the code below and pasting it in UniLogin.

          <br>Your code: ${code}<br><br>
          <a href='http://localhost:2137/?code=${code}' color='#ffffff'>Copy</a>
        </div><br>
        </div>
      </body>
      </html>
      `,
      replyTo: 'noreply.confirmation@unilogin.io',
    };
    return await this.sendMail(mailOptions);
  }
}
