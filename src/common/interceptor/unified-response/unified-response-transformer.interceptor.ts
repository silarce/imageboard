import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BYPASS_TRANSFORM_KEY } from './bypass-transform';

interface CommonResponse<T> {
  success: boolean;
  data: T | undefined;
}

@Injectable()
class UnifiedResponseTransformer<T> implements NestInterceptor<
  T,
  CommonResponse<T> | T
> {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<CommonResponse<T> | T> {
    const isBypass = this.reflector.getAllAndOverride<boolean>(
      BYPASS_TRANSFORM_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isBypass) {
      return next.handle() as Observable<T>;
    }

    return next.handle().pipe(
      map((data: T) => ({
        success: true,
        data: data,
      })),
    );
  }
}

export { UnifiedResponseTransformer };
export type { CommonResponse };
