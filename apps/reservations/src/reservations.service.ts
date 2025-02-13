import { Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationRepository } from './reservation.repository';
import { PAYMENTS_SREVICE, UserDto } from '@app/common';
import { PaymentsService } from 'apps/payments/src/payments.service';
import { ClientProvider, ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs';
import { UserDocument } from 'apps/auth/src/users/models/user.schema';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    @Inject(PAYMENTS_SREVICE) private readonly paymentsService: ClientProxy,
  ) {}

  async create(
    createReservationDto: CreateReservationDto,
    { email, _id: userId }: UserDto,
  ) {
    return this.paymentsService
      .send('create_order', { ...createReservationDto.order, email })
      .pipe(
        map((res) => {
          return this.reservationRepository.create({
            ...createReservationDto,
            timeStamp: new Date(),
            invoiceId: res.id,
            userId,
          });
        }),
      );
  }

  async findAll() {
    return this.reservationRepository.find({});
  }

  async findOne(_id: string) {
    return this.reservationRepository.findOne({ _id });
  }

  async update(_id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationRepository.findOneAndUpdate(
      { _id },
      { $set: updateReservationDto },
    );
  }

  async remove(_id: string) {
    return this.reservationRepository.findOneAndDelete({ _id });
  }
}
