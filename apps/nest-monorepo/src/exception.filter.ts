import { GqlExceptionFilter } from '@nestjs/graphql';
import { Catch } from '@nestjs/common';
import { GraphQLError } from 'graphql';

@Catch()
export class ExceptionFilter implements GqlExceptionFilter {
  catch(exception: any) {
    if (exception.code === 'ER_DUP_ENTRY') {
      return new GraphQLError(exception.code, {
        extensions: {
          code: exception.code,
          error: exception,
        },
      });
    }
    console.log('[ERROR]', JSON.stringify(exception));
    return exception;
  }
}
