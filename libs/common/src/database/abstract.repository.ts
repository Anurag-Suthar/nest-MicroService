// import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
// import { AbstractDocument } from './abstract.schema';
// import { Logger, NotFoundException } from '@nestjs/common';

// export abstract class AbstractRepository<TDocument extends AbstractDocument> {
//   protected abstract readonly logger: Logger;
//   constructor(protected readonly model: Model<TDocument>) {}

//   async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
//     const createDocument = new this.model({
//       ...document,
//       _id: new Types.ObjectId(),
//     });
//     return (await createDocument.save()).toJSON() as unknown as TDocument;
//   }

//   async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
//     const document = await this.model
//       .findOne(filterQuery)
//       .lean<TDocument>(true);
//     if (!document) {
//       this.logger.warn('Document was not found with filter Query', filterQuery);
//       throw new NotFoundException('Document was not found');
//     }
//     return document;
//   }

//   async findOneAndUpdate(
//     filterQuery: FilterQuery<TDocument>,
//     update: UpdateQuery<TDocument>,
//   ): Promise<TDocument> {
//     const document = await this.model
//       .findOneAndUpdate(filterQuery, update, {
//         new: true,
//       })
//       .lean<TDocument>(true);
//     if (!document) {
//       this.logger.warn('Document was not found with filter Query', filterQuery);
//       throw new NotFoundException('Document was not found');
//     }
//     return document;
//   }

//   async find(filterQuery: FilterQuery<TDocument>): Promise<TDocument[]> {
//     const document = await this.model.find(filterQuery).lean<TDocument[]>(true);

//     if (!document) {
//       this.logger.warn('Document was not found with filter Query', filterQuery);
//       throw new NotFoundException('Document was not found');
//     }
//     return document;
//   }

//   async findOneAndDelete(
//     filterQuery: FilterQuery<TDocument>,
//   ): Promise<TDocument> {
//     return await this.model.findOneAndDelete(filterQuery).lean<TDocument>(true);
//   }
// }

import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { AbstractDocument } from './abstract.schema';
import { Logger, NotFoundException } from '@nestjs/common';
import { AbstractEntity } from './abstract.entity';
import {
  EntityManager,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class AbstractRepository<T extends AbstractEntity<T>> {
  protected abstract readonly logger: Logger;
  constructor(
    private readonly entityRepository: Repository<T>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(entity: T): Promise<T> {
    return this.entityManager.save(entity);
  }

  async findOne(
    where: FindOptionsWhere<T>,
    relations?: FindOptionsRelations<T>,
  ): Promise<T> {
    const entity = await this.entityRepository.findOne({ where, relations });
    if (!entity) {
      this.logger.warn('Entity  not found with where', where);
      throw new NotFoundException('Entity was not found');
    }
    return entity;
  }

  async findOneAndUpdate(
    where: FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>,
  ): Promise<T> {
    const updateResult = await this.entityRepository.update(
      where,
      partialEntity,
    );

    if (!updateResult.affected) {
      this.logger.warn('Entity was not found with where', where);
      throw new NotFoundException('Entity was not found');
    }
    return this.findOne(where);
  }

  async find(where: FindOptionsWhere<T>) {
    return this.entityRepository.findBy(where);
  }

  async findOneAndDelete(where: FindOptionsWhere<T>) {
    return await this.entityRepository.delete(where);
  }
}
