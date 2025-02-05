import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { BaseUserRequestDto } from '../../user/dto/req/base.user.request.dto';

export class SignUpRequestDto extends PickType(BaseUserRequestDto, [
  'firstName',
  'lastName',
  'email',
  'password',
  'age',
  'city',
]) {
  @ApiProperty({
    example: 'device-1234',
    description: 'Unique device identifier',
  })
  @IsNotEmpty()
  @IsString()
  public readonly deviceId: string;
}

export class SignInRequestDto extends PickType(BaseUserRequestDto, [
  'email',
  'password',
]) {
  @ApiProperty({
    example: 'device-1234',
    description: 'Unique device identifier',
  })
  @IsNotEmpty()
  @IsString()
  public readonly deviceId: string;
}
