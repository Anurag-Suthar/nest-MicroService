import { IsEmail } from 'class-validator';
import { CreateOrderDto } from './create-order.dto';

export class PaymentsCreateOrderDto extends CreateOrderDto {
  @IsEmail()
  email: string;
}
