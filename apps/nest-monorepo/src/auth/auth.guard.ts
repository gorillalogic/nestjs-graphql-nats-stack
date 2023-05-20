import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { GqlExecutionContext } from '@nestjs/graphql';
import { CognitoService } from './cognito.service';
import { GraphQLError } from 'graphql';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger('AuthGuard');

  constructor(private cognitoService: CognitoService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      this.logger.log('No Token');
      throw new GraphQLError('FORBIDDEN');
    }

    try {
      const payload = await this.cognitoService.verify(token);
      // Hardcoded user role for all users;
      request.user = { id: payload.username, roles: ['user'] };
      this.logger.log('Jwt Session Token is valid', payload);
    } catch (err) {
      this.logger.log(err);
      throw new GraphQLError('EXPIRED_TOKEN');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
