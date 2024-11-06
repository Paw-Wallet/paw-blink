import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundException extends HttpException {
  constructor(businessCode: string, message?: string) {
    super(
      {
        code: businessCode,
        status: HttpStatus.NOT_FOUND,
        message: message || 'Not Found',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
