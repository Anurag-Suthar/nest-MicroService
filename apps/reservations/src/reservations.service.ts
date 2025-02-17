// import { Inject, Injectable } from '@nestjs/common';
// import { CreateReservationDto } from './dto/create-reservation.dto';
// import { UpdateReservationDto } from './dto/update-reservation.dto';
// import { ReservationRepository } from './reservation.repository';
// import { PAYMENTS_SREVICE, User } from '@app/common';

// import { ClientProxy } from '@nestjs/microservices';
// import { map } from 'rxjs';

// @Injectable()
// export class ReservationsService {
//   constructor(
//     private readonly reservationRepository: ReservationRepository,
//     @Inject(PAYMENTS_SREVICE) private readonly paymentsService: ClientProxy,
//   ) {}

//   async create(
//     createReservationDto: CreateReservationDto,
//     { email, _id: userId }: User,
//   ) {
//     return this.paymentsService
//       .send('create_order', { ...createReservationDto.order, email })
//       .pipe(
//         map((res) => {
//           return this.reservationRepository.create({
//             ...createReservationDto,
//             timeStamp: new Date(),
//             invoiceId: res.id,
//             userId,
//           });
//         }),
//       );
//   }

//   async findAll() {
//     return this.reservationRepository.find({});
//   }

//   async findOne(_id: string) {
//     return this.reservationRepository.findOne({ _id });
//   }

//   async update(_id: string, updateReservationDto: UpdateReservationDto) {
//     return this.reservationRepository.findOneAndUpdate(
//       { _id },
//       { $set: updateReservationDto },
//     );
//   }

//   async remove(_id: string) {
//     return this.reservationRepository.findOneAndDelete({ _id });
//   }
// }

import { Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationRepository } from './reservation.repository';
import { PAYMENTS_SREVICE, User } from '@app/common';

import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs';
import { Reservation } from './models/reservation.entity';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    @Inject(PAYMENTS_SREVICE) private readonly paymentsService: ClientProxy,
  ) {}

  async create(
    createReservationDto: CreateReservationDto,
    { email, id: userId }: User,
  ) {
    return this.paymentsService
      .send('create_order', { ...createReservationDto.order, email })
      .pipe(
        map((res) => {
          const reservations = new Reservation({
            ...createReservationDto,
            timeStamp: new Date(),
            invoiceId: res.id,
            userId,
          });
          return this.reservationRepository.create(reservations);
        }),
      );
  }

  async findAll() {
    return this.reservationRepository.find({});
  }

  async findOne(id: number) {
    return this.reservationRepository.findOne({ id });
  }

  async update(id: number, updateReservationDto: UpdateReservationDto) {
    return this.reservationRepository.findOneAndUpdate(
      { id },
      updateReservationDto,
    );
  }

  async remove(id: number) {
    return this.reservationRepository.findOneAndDelete({ id });
  }
}
