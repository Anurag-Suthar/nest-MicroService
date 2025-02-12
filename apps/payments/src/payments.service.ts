import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class PaymentsService {
  private razorpay = new Razorpay({
    key_id: this.configService.get('RAZORPAY_KEY_ID'),
    key_secret: this.configService.get('RAZORPAY_SECRET'),
  });
  constructor(private readonly configService: ConfigService) {}

  async createOrder({ amount, currency }: CreateOrderDto) {
    const options = {
      amount: amount * 100, // Razorpay accepts amount in paise
      currency,
      payment_capture: 1,
    };

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
