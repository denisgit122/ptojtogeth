import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Manager } from '@prisma/client';
import { AdminService } from '../admin';
import { LoginDto } from './dto';
import { MailService, PasswordService } from '../core';
import { ManagersService } from '../managers';

@Injectable()
export class AuthService {
  constructor(
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly passwordService: PasswordService,
    private readonly managersService: ManagersService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    let user;

    const admin = await this.adminService.getAdminByIdOrEmail(email);
    const manager = await this.managersService.getManagerByEmail(email);

    if (admin) {
      user = admin;
    } else if (manager) {
      user = manager;
      await this.managersService.updateLastLoginManager(manager.id);
    } else {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    if (!user) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    const passwordMatches = await this.passwordService.comparePasswords(
      password,
      user.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    const accessToken = await this.jwtService.sign(
      { id: user.id, strategy: 'access' },
      {
        expiresIn: '10m',
        secret: process.env.SECRET_ACCESS_WORD,
      },
    );

    const refreshToken = await this.jwtService.sign(
      { id: user.id, strategy: 'refresh' },
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

  async refresh(id: string) {
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

  async sendActivateToken(email: string): Promise<void> {
    const manager = await this.managersService.getManagerByEmail(email);

    const activateToken = await this.jwtService.sign(
      { id: manager.id, strategy: 'activate' },
      {
        expiresIn: '7d',
        secret: process.env.SECRET_ACTIVATE_WORD,
      },
    );

    await this.mailService.sendManagerActivate(manager, activateToken);
  }

  async activate(id: string, password: string): Promise<Manager> {
    return this.managersService.updateActivateManager(id, password);
  }
}
