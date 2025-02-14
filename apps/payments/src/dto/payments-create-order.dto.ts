import { IsEmail } from 'class-validator';
import { CreateOrderDto } from '@app/common';

export class PaymentsCreateOrderDto extends CreateOrderDto {
  @IsEmail()
  email: string;
}
