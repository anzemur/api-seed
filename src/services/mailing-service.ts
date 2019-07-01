import * as nodemailer from 'nodemailer';
import { Service } from './service';
import { SentMessageInfo } from 'nodemailer';

export interface EmailData {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}

/**
 * Service for sending transactional emails.
 */
export class MailingService extends Service {
  private mailingService: MailingService;
  private transport: any;

  private smtpOptions = {
    host  : process.env.SMTP_HOST,
    port  : +process.env.SMTP_PORT,
    secure: process.env.SMTP_USE_SSL !== 'false',
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
    }
  };

  constructor() {
    super(MailingService.name);
    this.transport = nodemailer.createTransport(this.smtpOptions);
    this.transport.verify((error: any, success: any) => {
      if (error) {
        this.logger.error('There was an error while creating SMTP transport: ', error);
      } else {
        this.logger.info('SMTP transport successfully created.');
      }
   });
  }

  getInstance(): MailingService {
    if (!this.mailingService) {
      this.mailingService = new MailingService();
    }
    return this.mailingService;
  }


  /**
   * Sends email based on given email data.
   * @param emailData Email data.
   */
  async sendMail(emailData: EmailData): Promise<boolean> {
   // replace(/\n/g, '<br>');
    try {
      const status: SentMessageInfo = await this.transport.sendMail(emailData);
      this.logger.info('Email successfully sent: ', status);
      return true;

    } catch (error) {
      this.logger.error('There was an error while sending email: ', error);
      return false;
    }
  }
}
