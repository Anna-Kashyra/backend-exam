import { PartialType, PickType } from '@nestjs/swagger';

import { BaseUserRequestDto } from './base.user.request.dto';

export class UserUpdateDto extends PartialType(
  PickType(BaseUserRequestDto, [
    'firstName',
    'lastName',
    'age',
    'avatar',
    'city',
    'bio',
  ] as const),
) {}
