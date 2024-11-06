import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const request = context.switchToHttp().getRequest();
    if (request.url === '/metrics') {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => ({
        code: HttpStatus.OK,
        status: 200,
        message: 'OK',
        data: data || null,
      })),
    );
  }
}
