import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Admin } from '@prisma/client';
import { AdminService } from '../admin';

@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(
    private adminService: AdminService,
    @Inject(JwtService) private readonly jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_ACCESS_WORD,
    });
  }

  async validate(payload: any): Promise<Admin> {
    let user: Admin;

    if (payload.strategy !== 'access') {
      throw new UnauthorizedException();
    }

    try {
      user = await this.adminService.getAdminByIdOrEmail(payload.id);

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
    private adminService: AdminService,
    @Inject(JwtService) private readonly jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_REFRESH_WORD,
    });
  }

  async validate(payload: any): Promise<Admin> {
    let user: Admin;

    if (payload.strategy !== 'refresh') {
      throw new UnauthorizedException();
    }

    try {
      user = await this.adminService.getAdminByIdOrEmail(payload.id);

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
