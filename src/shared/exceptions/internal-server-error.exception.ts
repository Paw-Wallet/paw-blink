import { HttpException, HttpStatus } from '@nestjs/common';

export class InternalServerErrorException extends HttpException {
  constructor(businessCode: string, message?: string) {
    super(
      {
        code: businessCode,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: message || 'Internal Server Error',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
