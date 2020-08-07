import nodemailer, {SentMessageInfo} from 'nodemailer';
import {MailOptions} from 'nodemailer/lib/json-transport';
import Mail from 'nodemailer/lib/mailer';
import mandrillTransport from 'nodemailer-mandrill-transport';
import {CannotSendEmail} from '../../core/utils/errors';
import {confirmationEmailHtml} from '../../core/utils/confirmationEmailHtml';
import {getNameFromEmail} from '../../core/utils/getNameFromEmail';
import {EmailConfig} from '../../config/config';

export class EmailService {
  private from: string;
  private copyToClipboardUrl: string;
  private emailLogo: string;
  private transport: Mail;

  constructor({copyToClipboardUrl, emailLogo, apiKey, from}: EmailConfig) {
    this.transport = nodemailer.createTransport(mandrillTransport({auth: {apiKey}}));
    this.from = from;
    this.copyToClipboardUrl = copyToClipboardUrl;
    this.emailLogo = emailLogo;
  }

  async sendMail(mailOptions: MailOptions): Promise<SentMessageInfo> {
    try {
      return await this.transport.sendMail(mailOptions);
    } catch (error) {
      throw new CannotSendEmail(error.message);
    }
  }

  async sendConfirmationMail(email: string, code: string): Promise<SentMessageInfo> {
    const mailOptions = {
      from: `UniLogin ${this.from}`,
      to: email,
      subject: '🎉 Verify your e-mail',
      html: confirmationEmailHtml({code: code, clipboardUrl: this.copyToClipboardUrl, logoUrl: this.emailLogo, username: getNameFromEmail(email)}),
      replyTo: this.from,
    };
    return this.sendMail(mailOptions);
  }
}
