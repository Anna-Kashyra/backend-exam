import { ApiProperty } from '@nestjs/swagger';

export class TokenPairResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsIn...' })
  accessToken: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsIn...' })
  refreshToken: string;
}
