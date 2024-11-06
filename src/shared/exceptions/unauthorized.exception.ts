import { HttpException, HttpStatus } from '@nestjs/common';

export class UnauthorizedException extends HttpException {
  constructor(businessCode: string, message?: string) {
    super(
      {
        code: businessCode,
        status: HttpStatus.UNAUTHORIZED,
        message: message || 'Unauthorized',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
