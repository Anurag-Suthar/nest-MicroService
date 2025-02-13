import { Injectable } from '@nestjs/common';
import { NotifyEmailDto } from './dto/notify-email.sto';
import e from 'express';

@Injectable()
export class NotificationsService {
  async notifyEmail({ email }: NotifyEmailDto) {
    console.log(email);
  }
}
