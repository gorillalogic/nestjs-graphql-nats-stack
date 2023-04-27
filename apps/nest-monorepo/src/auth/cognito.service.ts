import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CognitoJwtVerifier } from 'aws-jwt-verify';

@Injectable()
export class CognitoService {
  constructor(
    private configService: ConfigService<
      {
        cognito: {
          userPoolId: string;
          clientId: string;
        };
      },
      true
    >,
  ) {}

  async verify(accessToken: string) {
    const verifier = CognitoJwtVerifier.create({
      userPoolId: this.configService.get('userPoolId', { infer: true }),
      tokenUse: 'access',
      clientId: this.configService.get('clientId', { infer: true }),
    });

    return await verifier.verify(accessToken);
  }
}
