import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IResponse } from '@/common/interfaces/response.interface';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, IResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<IResponse<T>> {
    return next.handle().pipe(
      map((response: any) => {
        if (response && typeof response === 'object' && response.data !== undefined) {
          const formattedResponse: IResponse<T> = {
            success: true,
            data: response.data,
          };

          if ('count' in response) {
            formattedResponse['count'] = response.count;
          }

          return formattedResponse;
        }

        return {
          success: true,
          data: response,
        };
      }),
    );
  }
}
