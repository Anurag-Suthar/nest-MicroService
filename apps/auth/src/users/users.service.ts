import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';
import { ERROR_MESSAGES } from 'apps/auth/util/ERROR_MESSAGES';
import { GetUserDto } from './dto/get-user.dto';
@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UserRepository) {}
  async create(createUserDto: CreateUserDto) {
    await this.validateCreateUserDto(createUserDto);
    return await this.usersRepository.create({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    });
  }

  async validateCreateUserDto(createUserDto: CreateUserDto) {
    try {
      await this.usersRepository.findOne({ email: createUserDto.email });
    } catch (err) {
      return;
    }
    throw new UnprocessableEntityException(
      ERROR_MESSAGES.EMAIL_ALREADY_EXISITS,
    );
  }

  async verifyUser(email: string, password: string) {
    console.log('email password', email, password);
    const user = await this.usersRepository.findOne({ email });
    console.log(user);
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException(ERROR_MESSAGES.CREDENTIALS_NOT_VALID);
    }
    return user;
  }

  async getUser(getUserDto: GetUserDto) {
    return this.usersRepository.findOne(getUserDto);
  }
}
