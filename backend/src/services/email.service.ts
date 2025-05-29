import sgMail from '@sendgrid/mail';
import { AppError } from '../middleware/error.middleware';

export class EmailService {
  static async sendConfirmationEmail(email: string, name: string): Promise<void> {
    try {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

      const msg = {
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL || 'noreply@example.com',
        subject: 'Application Received',
        text: `Dear ${name},\n\nThank you for submitting your application. We have received your CV and will review it shortly.\n\nBest regards,\nThe Hiring Team`,
        html: `
          <h2>Application Received</h2>
          <p>Dear ${name},</p>
          <p>Thank you for submitting your application. We have received your CV and will review it shortly.</p>
          <p>Best regards,<br>The Hiring Team</p>
        `,
      };

      await sgMail.send(msg);
    } catch (error) {
      throw new AppError(500, 'Error sending confirmation email');
    }
  }
} 