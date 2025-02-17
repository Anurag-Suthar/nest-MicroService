// import { AbstractRepository } from '@app/common';
// import { Injectable, Logger } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { ReservationDocument } from './models/reservation.schema';

// @Injectable()
// export class ReservationRepository extends AbstractRepository<ReservationDocument> {
//   protected readonly logger = new Logger(ReservationRepository.name);
//   constructor(
//     @InjectModel(ReservationDocument.name)
//     reservationModel: Model<ReservationDocument>,
//   ) {
//     super(reservationModel);
//   }
// }

import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReservationDocument } from './models/reservation.schema';
import { Reservation } from './models/reservation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class ReservationRepository extends AbstractRepository<Reservation> {
  protected readonly logger = new Logger(ReservationRepository.name);
  constructor(
    @InjectRepository(Reservation)
    resertionsRepository: Repository<Reservation>,
    entityManager: EntityManager,
  ) {
    super(resertionsRepository, entityManager);
  }
}
