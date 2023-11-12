import { Injectable } from '@nestjs/common';
import { PasswordService } from './password.service';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });

    const passwordValid =
      user && (await this.passwordService.compare(password, user.password));

    if (user && passwordValid) {
      delete user.password;
      return user;
    }

    return null;
  }

  login(user: any) {
    const payload = { sub: user.id };
    return this.generateTokens(payload);
  }

  generateTokens(payload: { sub: string }) {
    return {
      accessToken: this.generateAccessToken(payload),
    };
  }

  generateAccessToken(payload: { sub: string }) {
    return this.jwtService.sign(payload);
  }
}
