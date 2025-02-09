import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { UserService } from './services/user.service';
import { UserUpdateDto } from './dto/req/user.update.dto';
import {
  PublicUserResponseDto,
  ShortUserResponseDto,
} from './dto/res/public.user.response.dto';
import {
  ApiPaginatedResponse,
  PaginatedDto,
} from '../../common/common.dto/paginated.response.dto';
import { CurrentUser } from '../auth/decorators/current.user.decorator';
import { IUserData } from '../auth/interfaces/user.data.interface';
import { UserQueryDto } from './dto/req/user.query.dto';
import { SortOrder } from '../../common/common.dto/base.query.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(AuthGuard('bearer'))
@ApiExtraModels(ShortUserResponseDto, PaginatedDto, UserQueryDto)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'List of All Users',
    description:
      'Getting a list of all users with pagination, sorting, and search functionality',
  })
  @ApiQuery({ name: 'page', required: false, example: 1, type: Number })
  @ApiQuery({ name: 'limit', required: false, example: 10, type: Number })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by user ID or email (UUID or email format)',
    type: String,
  })
  @ApiQuery({
    name: 'firstName',
    required: false,
    description: 'Filter by first name',
    type: String,
  })
  @ApiQuery({
    name: 'lastName',
    required: false,
    description: 'Filter by last name',
    type: String,
  })
  @ApiQuery({
    name: 'city',
    required: false,
    description: 'Filter by city',
    type: String,
  })
  @ApiQuery({
    name: 'order',
    required: false,
    description:
      'Sorting order by createdAt. Use "ASC" for ascending or "DESC" for descending.',
    enum: [SortOrder.ASC, SortOrder.DESC],
  })
  @ApiPaginatedResponse('entities', ShortUserResponseDto)
  @ApiBadRequestResponse({
    description: 'Invalid pagination or sorting parameters',
  })
  @ApiUnauthorizedResponse({ description: 'User Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @Get('list')
  public async findAllUsers(@Query() query: UserQueryDto) {
    return await this.userService.findAllUsers(query);
  }

  @ApiOperation({
    summary: 'Get Me',
    description: 'Retrieve an authorized user',
  })
  @ApiOkResponse({
    description: 'User retrieved successfully',
    type: PublicUserResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid UUID format' })
  @ApiUnauthorizedResponse({ description: 'User Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @Get('me')
  public async getMe(
    @CurrentUser() userData: IUserData,
  ): Promise<PublicUserResponseDto> {
    return await this.userService.getMe(userData);
  }

  @ApiOperation({
    summary: 'Update Me',
    description: 'Update an authorized user details',
  })
  @ApiOkResponse({
    description: 'User updated successfully',
    type: PublicUserResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'User Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @Patch('me')
  public async updateMe(
    @CurrentUser() userData: IUserData,
    @Body() dto: UserUpdateDto,
  ): Promise<PublicUserResponseDto> {
    return await this.userService.updateMe(userData, dto);
  }

  @ApiOperation({
    summary: 'Delete Me',
    description: 'Remove an authorized user from the database',
  })
  @ApiNoContentResponse({ description: 'User deleted successfully' })
  @ApiUnauthorizedResponse({ description: 'User Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('me')
  public async removeMe(@CurrentUser() userData: IUserData): Promise<boolean> {
    return await this.userService.removeMe(userData);
  }

  @ApiOperation({
    summary: 'Get User By ID',
    description: 'Retrieve a user by their unique identifier (UUID)',
  })
  @ApiOkResponse({
    description: 'User retrieved successfully',
    type: PublicUserResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid UUID format' })
  @ApiUnauthorizedResponse({ description: 'User Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @Get(':userId')
  public async getUserById(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<PublicUserResponseDto> {
    return await this.userService.getUserById(userId);
  }
}
