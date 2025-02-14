import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';
import { NOTIFICATIONS_SREVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { PaymentsCreateOrderDto } from './dto/payments-create-order.dto';
import { text } from 'stream/consumers';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SREVICE)
    private readonly notificationsService: ClientProxy,
  ) {}

  private razorpay = new Razorpay({
    key_id: this.configService.get('RAZORPAY_KEY_ID'),
    key_secret: this.configService.get('RAZORPAY_SECRET'),
  });

  async createOrder({ amount, currency, email }: PaymentsCreateOrderDto) {
    const options = {
      amount: amount * 100, // Razorpay accepts amount in paise
      currency,
      payment_capture: 1,
    };

    this.notificationsService.emit('notify_email', {
      email,
      text: `Your payment of ${options.amount} has complete successfully `,
    });

    try {
      const order = await this.razorpay.orders.create(options);
      return order;
    } catch (error) {
      throw new Error(`Razorpay order creation failed: ${error.message}`);
    }
  }

  async verifyPayment(signature: string, orderId: string, paymentId: string) {
    const secret = this.configService.get<string>('RAZORPAY_SECRET');

    const hash = crypto
      .createHmac('sha256', secret)
      .update(orderId + '|' + paymentId)
      .digest('hex');

    if (hash !== signature) {
      throw new Error('Invalid payment signature');
    }

    return { message: 'Payment verified successfully', paymentId };
  }
}
