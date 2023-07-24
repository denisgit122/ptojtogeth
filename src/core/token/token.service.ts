import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { EActionTokenType } from './interface';
import { PrismaService } from '../orm';
import { Action, Token } from '@prisma/client';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async generateTokenPair(id: string) {
    const accessToken = await this.jwtService.sign(
      { id, strategy: 'access' },
      {
        expiresIn: '10m',
        secret: process.env.SECRET_ACCESS_WORD,
      },
    );

    const refreshToken = await this.jwtService.sign(
      { id, strategy: 'refresh' },
      {
        expiresIn: '20m',
        secret: process.env.SECRET_REFRESH_WORD,
      },
    );

    return {
      accessToken: `Bearer ${accessToken}`,
      refreshToken: `Bearer ${refreshToken}`,
    };
  }

  async generateActionToken(id: string, tokenType: EActionTokenType) {
    let secret;
    let expiresIn;

    switch (tokenType) {
      case EActionTokenType.activate:
        secret = process.env.SECRET_ACTIVATE_WORD;
        expiresIn = '1d';
        break;
      case EActionTokenType.forgot:
        secret = process.env.SECRET_FORGOT_PASSWORD_WORD;
        expiresIn = '30m';
        break;
    }
    return this.jwtService.sign(
      { id, strategy: tokenType },
      { secret, expiresIn },
    );
  }

  async getTokenPairByRefreshToken(refreshToken: string): Promise<Token> {
    return this.prismaService.token.findFirst({
      where: {
        refreshToken,
      },
    });
  }

  async getActionTokenByTokenFromQuery(token: string): Promise<Action> {
    return this.prismaService.action.findFirst({
      where: {
        actionToken: token,
      },
    });
  }
}
