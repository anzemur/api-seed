import { Service } from './service';
import { SentMessageInfo, createTransport, Transporter } from 'nodemailer';

export interface EmailData {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export interface SmtpOptions {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

/**
 * Service for sending transactional emails.
 */
export class MailingService extends Service {
  private static instance: MailingService;
  private transport: Transporter;
  private smtpOptions: SmtpOptions = {
    host  : process.env.SMTP_HOST,
    port  : +process.env.SMTP_PORT,
    secure: process.env.SMTP_USE_SSL !== 'false',
    auth  : {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    }
  };

  private constructor() {
    super(MailingService.name);
    this.transport = createTransport(this.smtpOptions);
    this.transport.verify((error: any, success: any) => {
      if (error) {
        this.logger.error('There was an error while creating SMTP transport: ', error);
      } else {
        this.logger.info('SMTP transport successfully created.');
      }
   });
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

  /**
   * Returns instance of service, so its used as singleton.
   */
  static getInstance(): MailingService {
    if (!MailingService.instance) {
      MailingService.instance = new MailingService();
    }
    return MailingService.instance;
  }
}
