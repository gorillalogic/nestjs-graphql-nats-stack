import { GqlExceptionFilter } from '@nestjs/graphql';
import { Catch } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { Logger } from '@nestjs/common';

@Catch()
export class ExceptionFilter implements GqlExceptionFilter {
  private readonly logger = new Logger(ExceptionFilter.name);

  catch(exception: any) {
    if (exception.code === 'ER_DUP_ENTRY') {
      return new GraphQLError(exception.code, {
        extensions: {
          code: exception.code,
          error: exception,
          http: {
            status: 400,
          },
        },
      });
    }
    if (exception.code === 'EXPIRED_TOKEN' || exception.code === 'FORBIDDEN') {
      return new GraphQLError(exception.code, {
        extensions: {
          code: exception.code,
          error: exception,
          http: {
            status: 401,
          },
        },
      });
    }

    this.logger.log(JSON.stringify(exception));
    return exception;
  }
}
