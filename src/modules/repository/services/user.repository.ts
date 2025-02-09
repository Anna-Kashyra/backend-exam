import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { paginateRawAndEntities } from 'nestjs-typeorm-paginate';

import { UserEntity } from '../../../database/entities/user.entity';
import { UserQueryDto } from '../../user/dto/req/user.query.dto';
import { SortOrder } from '../../../common/common.dto/base.query.dto';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(UserEntity, dataSource.manager);
  }
  async findAllUsers(query: UserQueryDto) {
    const options = {
      page: +query?.page || 1,
      limit: +query?.limit || 10,
    };

    const queryBuilder = this.createQueryBuilder('user');

    queryBuilder.select([
      'user.id as "id"',
      'user.firstName as "firstName"',
      'user.lastName as "lastName"',
      'user.email as "email"',
      'user.city as "city"',
    ]);

    if (query.search && query.search.trim()) {
      const isUuid = this.isUUID(query.search);
      const isEmail = this.isEmail(query.search);

      if (isUuid) {
        queryBuilder.andWhere('user.id = :search', { search: query.search });
      } else if (isEmail) {
        queryBuilder.andWhere('LOWER(user.email) = :email', {
          email: query.search.toLowerCase(),
        });
      } else {
        throw new BadRequestException(
          'Invalid search parameter. Please provide a valid UUID or email.',
        );
      }
    }

    if (query.firstName) {
      queryBuilder.andWhere('LOWER(user.firstName) LIKE :firstName', {
        firstName: `%${query.firstName.toLowerCase()}%`,
      });
    }

    if (query.lastName) {
      queryBuilder.andWhere('LOWER(user.lastName) LIKE :lastName', {
        lastName: `%${query.lastName.toLowerCase()}%`,
      });
    }

    if (query.city) {
      queryBuilder.andWhere('LOWER(user.city) LIKE :city', {
        city: `%${query.city.toLowerCase()}%`,
      });
    }

    if (query.order) {
      const sortOrder = query.order === SortOrder.ASC ? 'ASC' : 'DESC';
      queryBuilder.orderBy('user.createdAt', sortOrder);
    } else {
      queryBuilder.orderBy('user.createdAt', 'DESC');
    }

    return await paginateRawAndEntities(queryBuilder, options);
  }

  async findById(userId: string) {
    return this.findOneBy({ id: userId });
  }

  async findByEmail(email: string) {
    return this.findOneBy({ email });
  }

  async updateUser(user: UserEntity, dto: Partial<UserEntity>) {
    return this.save({ ...user, ...dto });
  }

  async removeUser(user: UserEntity) {
    return this.remove(user);
  }

  private isUUID(value: string): boolean {
    const uuidRegex =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return uuidRegex.test(value);
  }

  private isEmail(value: string): boolean {
    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return emailRegex.test(value);
  }
}
