import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Get,
  Query,
} from '@nestjs/common';

import { PostService } from './dto/services/post.service';
import { PostUpdateDto } from './dto/req/post.update.dto';
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
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BasePostResponseDto } from './dto/res/base.post.response.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorators/current.user.decorator';
import { IUserData } from '../auth/interfaces/user.data.interface';
import { PostCreateDto } from './dto/req/post.create.dto';
import {
  ApiPaginatedResponse,
  PaginatedDto,
} from '../../common/common.dto/paginated.response.dto';
import { PostQueryDto } from './dto/req/post.query.dto';
import { SortOrder } from '../../common/common.dto/base.query.dto';

@ApiTags('Posts')
@Controller('post')
@ApiExtraModels(BasePostResponseDto, PaginatedDto, PostQueryDto)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('bearer'))
  @ApiOperation({
    summary: 'Create Post',
    description: 'Creating a new post by an authorized user',
  })
  @ApiCreatedResponse({
    description: 'Post successfully created',
    type: BasePostResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid UUID format' })
  @ApiUnauthorizedResponse({ description: 'User Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @Post('create')
  public async createPost(
    @CurrentUser() userData: IUserData,
    @Body() dto: PostCreateDto,
  ): Promise<BasePostResponseDto> {
    return await this.postService.createPost(userData, dto);
  }

  @ApiOperation({
    summary: 'Get List of Posts',
    description: 'Getting List of all posts',
  })
  @ApiQuery({ name: 'page', required: false, example: 1, type: Number })
  @ApiQuery({ name: 'limit', required: false, example: 10, type: Number })
  @ApiQuery({
    name: 'order',
    required: false,
    description:
      'Sorting order by createdAt. Use "ASC" for ascending or "DESC" for descending.',
    enum: [SortOrder.ASC, SortOrder.DESC],
  })
  @ApiOkResponse({
    description: 'List of posts retrieved successfully',
    type: PaginatedDto<BasePostResponseDto>,
  })
  @ApiPaginatedResponse('entities', BasePostResponseDto)
  @ApiBadRequestResponse({
    description: 'Invalid pagination or sorting parameters',
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @Get('list')
  public async getAllPosts(
    @Query() query: PostQueryDto,
  ): Promise<PaginatedDto<BasePostResponseDto>> {
    return await this.postService.getAllPosts(query);
  }

  @ApiOperation({
    summary: 'Get User Posts by user id',
    description: 'Retrieve all posts created by a specific user',
  })
  @ApiQuery({ name: 'page', required: false, example: 1, type: Number })
  @ApiQuery({ name: 'limit', required: false, example: 10, type: Number })
  @ApiQuery({
    name: 'order',
    required: false,
    description:
      'Sorting order by createdAt. Use "ASC" for ascending or "DESC" for descending.',
    enum: [SortOrder.ASC, SortOrder.DESC],
  })
  @ApiPaginatedResponse('entities', BasePostResponseDto)
  @ApiOkResponse({
    description: 'List of user posts retrieved successfully',
    type: PaginatedDto<BasePostResponseDto>,
  })
  @ApiBadRequestResponse({
    description: 'Invalid pagination or sorting parameters',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @Get('user/:userId')
  public async getUserPosts(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query() query: PostQueryDto,
  ): Promise<PaginatedDto<BasePostResponseDto>> {
    return await this.postService.getUserPosts(userId, query);
  }

  @ApiOperation({
    summary: 'Get Post by Id',
    description: 'Getting post by Id',
  })
  @ApiOkResponse({
    description: 'Post retrieved successfully',
    type: BasePostResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Post not found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @Get(':postId')
  public async getPostById(
    @Param('postId', ParseUUIDPipe) postId: string,
  ): Promise<BasePostResponseDto> {
    return await this.postService.getPostById(postId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('bearer'))
  @ApiOperation({
    summary: 'Update Post',
    description: 'Updating the post by an authorized user',
  })
  @ApiOkResponse({
    description: 'Post successfully updated',
    type: BasePostResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid UUID format' })
  @ApiUnauthorizedResponse({ description: 'User Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Post not found' })
  @Patch(':postId')
  public async updatePost(
    @CurrentUser() userData: IUserData,
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() dto: PostUpdateDto,
  ): Promise<BasePostResponseDto> {
    return await this.postService.updatePost(userData, postId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('bearer'))
  @ApiOperation({
    summary: 'Delete Post',
    description: 'Delete the post of an authorized user from the database',
  })
  @ApiNoContentResponse({ description: 'Post deleted successfully' })
  @ApiUnauthorizedResponse({ description: 'User Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Post not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':postId')
  public async deletePost(
    @CurrentUser() userData: IUserData,
    @Param('postId', ParseUUIDPipe) postId: string,
  ) {
    return await this.postService.deletePost(userData, postId);
  }
}
