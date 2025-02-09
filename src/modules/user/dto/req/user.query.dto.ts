import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { BaseQueryDto } from '../../../../common/common.dto/base.query.dto';

export class UserQueryDto extends PickType(BaseQueryDto, [
  'page',
  'limit',
  'search',
  'order',
]) {
  @ApiProperty({ required: false, description: 'User filtering by First Name' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ required: false, description: 'User filtering by Last Name' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ required: false, description: 'User filtering by city' })
  @IsOptional()
  @IsString()
  city?: string;
}
