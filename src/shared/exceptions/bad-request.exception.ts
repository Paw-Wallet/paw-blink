import { HttpException, HttpStatus } from '@nestjs/common';

export class BadRequestException extends HttpException {
  constructor(businessCode: string, message?: string) {
    super(
      {
        code: businessCode,
        status: HttpStatus.BAD_REQUEST,
        message: message || 'Bad Request',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
