import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IManager, ManagerService } from '../manager';
import { User } from '@prisma/client';

@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(
    private readonly managersService: ManagerService,
    @Inject(JwtService) private readonly jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_ACCESS_WORD,
    });
  }

  async validate(payload: any): Promise<User> {
    if (payload.strategy !== 'access') {
      throw new UnauthorizedException();
    }

    try {
      const user = await this.managersService.getManagerByIdOrEmail(payload.id);

      if (!user) {
        throw new UnauthorizedException();
      }

      return user;
    } catch (err) {
      console.log(new Date().toISOString(), payload);
      throw new UnauthorizedException();
    }
  }
}

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    private readonly managersService: ManagerService,
    @Inject(JwtService) private readonly jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_REFRESH_WORD,
    });
  }

  async validate(payload: any): Promise<User> {
    if (payload.strategy !== 'refresh') {
      throw new UnauthorizedException();
    }

    try {
      const user = await this.managersService.getManagerByIdOrEmail(payload.id);

      if (!user) {
        throw new UnauthorizedException();
      }

      return user;
    } catch (err) {
      console.log(new Date().toISOString(), payload);
      throw new UnauthorizedException();
    }
  }
}

@Injectable()
export class ActivateStrategy extends PassportStrategy(Strategy, 'activate') {
  constructor(
    private managerService: ManagerService,
    @Inject(JwtService) private readonly jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_ACTIVATE_WORD,
    });
  }

  async validate(payload: any): Promise<IManager> {
    if (payload.strategy !== 'activate') {
      throw new UnauthorizedException();
    }

    try {
      const manager = await this.managerService.getManagerByIdOrEmail(payload.id);

      if (!manager) {
        throw new UnauthorizedException();
      }

      return manager;
    } catch (err) {
      console.log(new Date().toISOString(), payload);
      throw new UnauthorizedException();
    }
  }
}

@Injectable()
export class ForgotStrategy extends PassportStrategy(Strategy, 'forgot') {
  constructor(
    private managerService: ManagerService,
    @Inject(JwtService) private readonly jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_FORGOT_PASSWORD_WORD,
    });
  }

  async validate(payload: any): Promise<IManager> {
    if (payload.strategy !== 'forgot') {
      throw new UnauthorizedException();
    }

    try {
      const manager = await this.managerService.getManagerByIdOrEmail(payload.id);

      if (!manager) {
        throw new UnauthorizedException();
      }

      return manager;
    } catch (err) {
      console.log(new Date().toISOString(), payload);
      throw new UnauthorizedException();
    }
  }
}