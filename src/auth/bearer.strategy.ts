import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Admin, Manager } from '@prisma/client';
import { AdminService } from '../admin';
import { ManagersService } from '../managers';

@Injectable()
class BaseAccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(
      private readonly adminService: AdminService,
      private readonly managersService: ManagersService,
      @Inject(JwtService) private readonly jwtService: JwtService,
      secretOrKey: string,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey,
    });
  }

  async validate(payload: any): Promise<Admin | Manager> {
    let user: Admin | Manager;

    if (payload.strategy !== this.name) {
      throw new UnauthorizedException();
    }

    try {
      const admin = await this.adminService.getAdminByIdOrEmail(payload.id);
      const manager = await this.managersService.getManagerByIdOrEmail(payload.id);

      if (admin) {
        user = admin;
      }

      if (manager) {
        user = manager;
      }

      if (!admin && !manager) {
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
export class AccessStrategy extends BaseAccessStrategy {
  constructor(
      adminService: AdminService,
      managersService: ManagersService,
      @Inject(JwtService) jwtService: JwtService,
  ) {
    super(adminService, managersService, jwtService, process.env.SECRET_ACCESS_WORD);
  }
}

@Injectable()
export class RefreshStrategy extends BaseAccessStrategy {
  constructor(
      adminService: AdminService,
      managersService: ManagersService,
      @Inject(JwtService) jwtService: JwtService,
  ) {
    super(adminService, managersService, jwtService, process.env.SECRET_REFRESH_WORD);
  }
}

@Injectable()
export class ActivateStrategy extends PassportStrategy(Strategy, 'activate') {
  constructor(
      private managerService: ManagersService,
      @Inject(JwtService) private readonly jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_ACTIVATE_WORD,
    });
  }

  async validate(payload: any): Promise<Manager> {
    let manager: Manager;

    if (payload.strategy !== this.name) {
      throw new UnauthorizedException();
    }

    try {
      manager = await this.managerService.getManagerByIdOrEmail(payload.id);

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