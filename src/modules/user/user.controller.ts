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
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
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
import { BaseQueryDto } from '../../common/common.dto/base.query.dto';
import { CurrentUser } from '../auth/decorators/current.user.decorator';
import { IUserData } from '../auth/interfaces/user.data.interface';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(AuthGuard('bearer'))
@ApiExtraModels(ShortUserResponseDto, PaginatedDto, BaseQueryDto)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'List of All Users',
    description:
      'Getting a list of all users with pagination, sorting, and search functionality',
  })
  @ApiPaginatedResponse('entities', ShortUserResponseDto)
  @ApiBadRequestResponse({
    description: 'Invalid pagination or sorting parameters',
  })
  @ApiUnauthorizedResponse({ description: 'User Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @Get('/list')
  public async findAllUsers(@Query() query: BaseQueryDto) {
    return await this.userService.findAllUsers(query);
  }

  @ApiOperation({
    summary: 'List of All Users With Their Posts',
    description:
      'Getting a list of all users along with their posts, supporting pagination, sorting, and search',
  })
  @ApiPaginatedResponse('entities', ShortUserResponseDto)
  @ApiBadRequestResponse({
    description: 'Invalid pagination or sorting parameters',
  })
  @ApiUnauthorizedResponse({ description: 'User Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @Get('/list-with-posts')
  public async findAllUsersWithPosts(@Query() query: BaseQueryDto) {
    return await this.userService.findAllUsersWithPosts(query);
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

  @ApiOperation({
    summary: 'Find Me',
    description: 'Retrieve an authorized user',
  })
  @ApiCreatedResponse({
    description: 'User retrieved successfully',
    type: PublicUserResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid UUID format' })
  @ApiUnauthorizedResponse({ description: 'User Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @Post('me')
  public async findMe(
    @CurrentUser() userData: IUserData,
  ): Promise<PublicUserResponseDto> {
    console.log('Current user data:', userData);
    return await this.userService.findMe(userData);
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
  @Delete('me')
  public async removeMe(@CurrentUser() userData: IUserData): Promise<boolean> {
    return await this.userService.removeMe(userData);
  }
}
