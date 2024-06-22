import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AuthDto } from './dto';

import { PrismaService } from '@/prisma/prisma.service';
import { TTokens } from './types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signupLocal(dto: AuthDto): Promise<TTokens> {
    const hash = await this.hashData(dto.password);

    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        hash,
      },
    });

    const tokens = await this.getTokens(newUser.id, newUser.email);

    await this.updateRtHash(newUser.id, tokens.refresh_token);

    return tokens;
  }

  signInLocal() {}

  logout() {}

  refreshTokens() {}

  async updateRtHash(userId: number, refreshToken: string) {
    const hash = await this.hashData(refreshToken);

    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRt: hash },
    });
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async getTokens(userId: number, email: string): Promise<TTokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        { expiresIn: 60 * 15, secret: process.env.ACCESS_TOKEN_KEY },
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        { expiresIn: 60 * 6 * 24 * 7, secret: process.env.REFRESH_TOKEN_KEY },
      ),
    ]);

    return { access_token: at, refresh_token: rt };
  }
}
