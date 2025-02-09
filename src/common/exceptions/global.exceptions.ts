import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { ERROR_MESSAGES } from './error.constants';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();

    let status: number;
    let messages: string | string[];

    if (exception instanceof HttpException) {
      const errorResponse = exception.getResponse();
      messages = Array.isArray(errorResponse['message'])
        ? errorResponse['message']
        : [errorResponse['message']];
      status = exception.getStatus();
    } else if (exception instanceof QueryFailedError) {
      messages = ERROR_MESSAGES.DATABASE_ERROR;
      status = 500;
    } else {
      status = 500;
      messages = ERROR_MESSAGES.SERVER_ERROR;
    }
    this.logger.error(exception);

    response.status(status).json({
      statusCode: status,
      messages,
      // timestamp: new Date().toISOString(),
      // path: request.url,
    });
  }
}
