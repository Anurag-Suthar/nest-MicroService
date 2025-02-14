import { Injectable } from '@nestjs/common';
import { NotifyEmailDto } from './dto/notify-email.sto';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationsService {
  constructor(private readonly configService: ConfigService) {}
  private readonly transporter = nodemailer.createTransport({
    // service: 'gmail',
    // auth: {
    //   type: 'OAuth2',
    //   user: this.configService.get('SMTP_USER'),
    //   clientId: this.configService.get('GOOGLE_OAUTH_CLIENT_ID'),
    //   clientSecret: this.configService.get('GOOGLE_OAUTH_CLIENT_SECRET'),
    //   refreshToken: this.configService.get('GOOGLE_OAUTH_REFRESH_TOKEN'),
    // },
    host: this.configService.get('SMTP_HOST'),
    port: 587, // Use 465 for SSL
    secure: false, // true for 465, false for other ports
    auth: {
      user: this.configService.get('BREVO_SMTP_USER'), // Your Brevo email
      pass: this.configService.get('BREVO_SMTP_PASSWORD'), // Your Brevo SMTP password
    },
  });
  async notifyEmail({ email, text }: NotifyEmailDto) {
    console.log(email);
    this.transporter.sendMail({
      from: this.configService.get('BREVO_SMTP_USER'),
      to: email,
      subject: 'Nest Microservice Notification',
      text,
    });
  }
}
