import { Catch, RpcExceptionFilter } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { QueryFailedError } from 'typeorm';
import { Logger } from '@nestjs/common';

@Catch(QueryFailedError)
export class ExceptionFilter implements RpcExceptionFilter<QueryFailedError> {
  private readonly logger = new Logger(ExceptionFilter.name);

  catch(exception: QueryFailedError): Observable<any> {
    this.logger.log(JSON.stringify(exception));
    return throwError(() => exception.driverError);
  }
}
