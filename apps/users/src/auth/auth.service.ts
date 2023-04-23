import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user?.email !== pass) {
      throw new UnauthorizedException();
    }
    const { ...result } = user;
    // TODO: Implement authentication logic

    return result;
  }
}
