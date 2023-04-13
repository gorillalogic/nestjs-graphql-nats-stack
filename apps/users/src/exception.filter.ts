import { Catch, RpcExceptionFilter } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class ExceptionFilter implements RpcExceptionFilter<QueryFailedError> {
  catch(exception: QueryFailedError): Observable<any> {
    console.log(`[ERROR]: ${JSON.stringify(exception)}`);
    return throwError(() => exception.driverError);
  }
}
