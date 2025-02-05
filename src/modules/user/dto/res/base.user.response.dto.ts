import { ApiProperty } from '@nestjs/swagger';

export class BaseUserResponseDto {
  @ApiProperty({
    example: 'f063e460-1cb8-4b44-8376-d3ca655798cd',
    description: 'The id of the User',
  })
  public readonly id: string;

  @ApiProperty({
    example: 'John',
    description: 'The name of the User',
  })
  public readonly firstName: string;

  @ApiProperty({
    example: 'Dow',
    description: 'The last name of the User',
  })
  public readonly lastName: string;

  @ApiProperty({
    example: 'test@gmail.com',
    description: 'The email of the User',
  })
  public readonly email: string;

  @ApiProperty({
    example: 'https://example.com/image.png',
    description: 'The avatar of the User',
    required: false,
  })
  public readonly avatar?: string;

  @ApiProperty({
    example: 18,
    description: 'The age of the User',
    required: false,
  })
  public readonly age?: number;

  @ApiProperty({
    example: 'New York',
    description: 'User city',
    required: false,
  })
  public readonly city?: string;

  @ApiProperty({
    description: 'About User',
    required: false,
  })
  public readonly bio?: string;

  @ApiProperty({ required: false })
  public readonly createdAt?: Date;

  @ApiProperty({ required: false })
  public readonly updatedAt?: Date;
}
