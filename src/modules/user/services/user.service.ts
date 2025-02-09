import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { UserUpdateDto } from '../dto/req/user.update.dto';
import { PaginatedDto } from '../../../common/common.dto/paginated.response.dto';
import {
  PublicUserResponseDto,
  ShortUserResponseDto,
} from '../dto/res/public.user.response.dto';
import { UserRepository } from '../../repository/services/user.repository';
import { RefreshTokenRepository } from '../../repository/services/refresh.token.repository';
import { IUserData } from '../../auth/interfaces/user.data.interface';
import { UserMapper } from './user.mapper';
import { UserEntity } from '../../../database/entities/user.entity';
import { ERROR_MESSAGES } from '../../../common/exceptions/error.constants';
import { UserQueryDto } from '../dto/req/user.query.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  public async findAllUsers(
    query?: UserQueryDto,
  ): Promise<PaginatedDto<ShortUserResponseDto>> {
    const [pagination, rawEntities] =
      await this.userRepository.findAllUsers(query);

    const users = rawEntities.map((user) =>
      UserMapper.toShortResponseDTO(user as UserEntity),
    );

    return {
      page: pagination.meta.currentPage,
      pages: pagination.meta.totalPages,
      countItems: pagination.meta.totalItems,
      entities: users,
    };
  }

  public async getMe(userData: IUserData): Promise<PublicUserResponseDto> {
    if (!userData) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
    }
    const user = await this.userRepository.findById(userData.userId);
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    this.logger.debug(`User found: ${JSON.stringify(user)}`);
    return UserMapper.toPublicResponseDTO(user);
  }

  public async updateMe(
    userData: IUserData,
    dto: UserUpdateDto,
  ): Promise<PublicUserResponseDto> {
    const user = await this.userRepository.findById(userData.userId);
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    const updatedUser = await this.userRepository.updateUser(user, dto);
    return UserMapper.toPublicResponseDTO(updatedUser);
  }

  public async removeMe(userData: IUserData): Promise<boolean> {
    const user = await this.userRepository.findById(userData.userId);
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    await this.refreshTokenRepository.delete({ userId: userData.userId });
    await this.userRepository.removeUser(user);
    return true;
  }

  public async getUserById(userId: string): Promise<PublicUserResponseDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    return UserMapper.toPublicResponseDTO(user);
  }

  public async isEmailUnique(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (user) {
      throw new ConflictException('User with this email already exists');
    }
  }
}
