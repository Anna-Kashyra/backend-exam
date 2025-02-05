import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class BaseQueryDto {
  @ApiProperty({
    required: false,
    description: 'Sorting field (e.g., "firstName")',
  })
  @IsOptional()
  @IsString()
  public sort: string;

  @ApiProperty({ required: false, default: SortOrder.ASC, enum: SortOrder })
  @IsOptional()
  @IsEnum(SortOrder)
  public order: SortOrder = SortOrder.ASC;

  @ApiProperty({
    required: false,
    default: 1,
    type: 'number',
    description: 'Page number (min: 1)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  public page = 1;

  @ApiProperty({
    required: false,
    default: 10,
    type: 'number',
    description: 'Items per page (min: 1, max: 100)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  public limit = 10;

  @ApiProperty({ required: false, description: 'Search query' })
  @IsOptional()
  @IsString()
  public search: string;
}
