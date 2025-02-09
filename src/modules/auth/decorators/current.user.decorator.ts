import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { ERROR_MESSAGES } from '../../../common/exceptions/error.constants';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.user) {
      throw new BadRequestException(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    return request.user;
  },
);
