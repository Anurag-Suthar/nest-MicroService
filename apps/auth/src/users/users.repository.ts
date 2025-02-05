import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { extend } from 'joi';
import { UserDocument } from './models/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UsersModule } from './users.module';
import { Model } from 'mongoose';

@Injectable()
export class UserRepository extends AbstractRepository<UserDocument> {
  protected readonly logger = new Logger(UserRepository.name);

  constructor(@InjectModel(UserDocument.name) userModel: Model<UserDocument>) {
    super(userModel);
  }
}
