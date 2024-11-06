import { HttpException, HttpStatus } from '@nestjs/common';

export class ForbiddenException extends HttpException {
  constructor(businessCode: string, message?: string) {
    super(
      {
        code: businessCode,
        status: HttpStatus.FORBIDDEN,
        message: message || 'Forbidden',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
