// import { AbstractRepository } from '@app/common';
// import { Injectable, Logger } from '@nestjs/common';
// import { User } from '@app/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';

// @Injectable()
// export class UserRepository extends AbstractRepository<User> {
//   protected readonly logger = new Logger(UserRepository.name);

//   constructor(@InjectModel(User.name) userModel: Model<User>) {
//     super(userModel);
//   }
// }

import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { User } from '@app/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class UserRepository extends AbstractRepository<User> {
  protected readonly logger = new Logger(UserRepository.name);

  constructor(
    @InjectRepository(User) userRepository: Repository<User>,
    entityManager: EntityManager,
  ) {
    super(userRepository, entityManager);
  }
}
