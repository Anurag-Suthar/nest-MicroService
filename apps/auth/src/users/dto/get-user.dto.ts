import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetUserDto {
  // @IsString()
  // @IsNotEmpty()
  // _id: string;

  @IsNumber()
  @IsNotEmpty()
  id: number;
}
