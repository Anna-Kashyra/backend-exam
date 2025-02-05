import { TokenPairResponseDto } from './token.pair.response.dto';
import { ShortUserResponseDto } from '../../user/dto/res/public.user.response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({ type: TokenPairResponseDto })
  tokens: TokenPairResponseDto;

  @ApiProperty({ type: ShortUserResponseDto })
  user: ShortUserResponseDto;
}
