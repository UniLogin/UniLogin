import nodemailer from 'nodemailer';
import {MailOptions} from 'nodemailer/lib/json-transport';
import {CannotSendEmail} from '../..';

export class EmailService {
  private transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'user',
      pass: 'pass'
    },
  })

  sendMail(mailOptions: MailOptions) {
    this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          throw new CannotSendEmail(error.message);
      }
    });
  }

  sendConfirmationMail() {
    const mailOptions = {

    }
    this.sendMail(mailOptions)
  }
}
