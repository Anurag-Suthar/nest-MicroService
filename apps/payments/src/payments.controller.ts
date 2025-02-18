import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { PaymentsCreateOrderDto } from './dto/payments-create-order.dto';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern('create_order')
  @UsePipes(new ValidationPipe())
  // @Post('create-order')
  async createOrder(
    @Payload() data: PaymentsCreateOrderDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    channel.ack(originalMsg);

    return this.paymentsService.createOrder(data);
  }

  @Post('verify-payment')
  async verifyPayment(
    @Body()
    body: {
      razorpay_signature: string;
      razorpay_order_id: string;
      razorpay_payment_id: string;
    },
  ) {
    return this.paymentsService.verifyPayment(
      body.razorpay_signature,
      body.razorpay_order_id,
      body.razorpay_payment_id,
    );
  }
}
