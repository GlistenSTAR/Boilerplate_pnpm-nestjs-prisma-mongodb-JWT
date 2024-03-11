/*
| Developed by Glisten
| Filename : remove-password.interceptor.ts
| Author : Alexandre Schaffner (alexandre.s@Glisten.com)
*/

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class RemovePasswordInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        delete data.user.password;
        return data;
      }),
    );
  }
}
