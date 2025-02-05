import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { paginateRawAndEntities } from 'nestjs-typeorm-paginate';

import { UserUpdateDto } from '../dto/req/user.update.dto';
import { PaginatedDto } from '../../../common/common.dto/paginated.response.dto';
import {
  PublicUserResponseDto,
  ShortUserResponseDto,
} from '../dto/res/public.user.response.dto';
import { BaseQueryDto } from '../../../common/common.dto/base.query.dto';
import { UserRepository } from '../../repository/services/user.repository';
import { RefreshTokenRepository } from '../../repository/services/refresh.token.repository';
import { IUserData } from '../../auth/interfaces/user.data.interface';
import { UserMapper } from './user.mapper';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  public async findAllUsers(
    query?: BaseQueryDto,
  ): Promise<PaginatedDto<ShortUserResponseDto>> {
    const options = {
      page: +query?.page || 1,
      limit: +query?.limit || 10,
    };

    const queryBuilder = this.userRepository.createQueryBuilder('user');
    queryBuilder.select([
      'user.firstName',
      'user.lastName',
      'user.avatar',
      'user.city',
    ]);
    // TODO
    if (query.search) {
      queryBuilder.andWhere('LOWER(user.firstName) LIKE :search', {
        search: `%${query.search.toLowerCase()}%`,
      });
    }

    const [pagination, rawEntities] = await paginateRawAndEntities(
      queryBuilder,
      options,
    );

    return {
      page: pagination.meta.currentPage,
      pages: pagination.meta.totalPages,
      countItems: pagination.meta.totalItems,
      entities: rawEntities as [ShortUserResponseDto],
    };
  }

  public async findAllUsersWithPosts(
    query?: BaseQueryDto,
  ): Promise<PaginatedDto<ShortUserResponseDto>> {
    const options = {
      page: +query?.page || 1,
      limit: +query?.limit || 10,
    };

    const [entities, count] = await this.userRepository.findAndCount({
      select: {
        firstName: true,
        lastName: true,
        avatar: true,
        city: true,
        id: true,
      },
      relations: {
        posts: true,
      },
      skip: (options.page - 1) * options.limit,
      take: options.limit,
    });

    return {
      page: options.page,
      pages: Math.ceil(count / options.limit),
      countItems: count,
      entities: entities,
    };
  }

  public async getUserById(userId: string): Promise<PublicUserResponseDto> {
    const user = await this.userRepository.findOneBy({
      id: userId,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return UserMapper.toPublicResponseDTO(user);
  }

  public async findMe(userData: IUserData): Promise<PublicUserResponseDto> {
    const user = await this.userRepository.findOneBy({ id: userData.userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    this.logger.debug(`User found: ${JSON.stringify(user)}`);
    return UserMapper.toPublicResponseDTO(user);
  }

  public async updateMe(
    userData: IUserData,
    dto: UserUpdateDto,
  ): Promise<PublicUserResponseDto> {
    const user = await this.userRepository.findOneBy({ id: userData.userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const updatedUser = await this.userRepository.save({ ...user, ...dto });
    return UserMapper.toPublicResponseDTO(updatedUser);
  }

  public async removeMe(userData: IUserData): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { id: userData.userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.refreshTokenRepository.delete({ userId: userData.userId });
    await this.userRepository.remove(user);
    return true;
  }

  public async isEmailUnique(email: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ email });
    if (user) {
      throw new ConflictException('User with this email already exists');
    }
  }
}
