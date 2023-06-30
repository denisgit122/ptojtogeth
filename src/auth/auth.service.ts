import {BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {Manager} from '@prisma/client';
import {AdminService} from '../admin';
import {ChangePasswordDto, LoginDto} from './dto';
import {EActionTokenType, MailService, PasswordService, TokenService} from '../core';
import {EStatusManager, ManagerService} from '../managers';

@Injectable()
export class AuthService {
  constructor(
    private readonly adminService: AdminService,
    private readonly mailService: MailService,
    private readonly passwordService: PasswordService,
    private readonly managerService: ManagerService,
    private readonly tokenService: TokenService
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    let user;

    const admin = await this.adminService.getAdminByIdOrEmail(email);
    const manager = await this.managerService.getManagerByIdOrEmail(email);

    if (admin) {
      user = admin;
    } else if (manager && manager.status === EStatusManager.UNBANNED) {
      user = manager;
      await this.managerService.updateManager(manager.id, {last_login: new Date()});
    } else if (manager && manager.status === EStatusManager.BANNED) {
      throw new HttpException('You cannot log in because your account is banned', HttpStatus.FORBIDDEN)
    }
    else {
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

    return this.tokenService.generateTokenPair(user.id);
  }

  async refresh(id: string) {
    return this.tokenService.generateTokenPair(id);
  }

  async sendActivateToken(email: string): Promise<void> {
    const manager = await this.managerService.getManagerByIdOrEmail(email);

    if (manager.is_active === true) {
      throw new HttpException('Your account is already active', HttpStatus.CONFLICT);
    }

    if (manager.status === EStatusManager.BANNED) {
      throw new HttpException('Your account is banned', HttpStatus.CONFLICT);
    }

    const activateToken = await this.tokenService.generateActionToken(manager.id, EActionTokenType.activate)

    await this.mailService.sendManagerActivate(manager, activateToken);
  }

  async activate(id: string, password: string): Promise<Manager> {
    return this.managerService.updateManager(id, {password, is_active: true});
  }

  async changePassword(body: ChangePasswordDto, id: string): Promise<void> {
    const manager = await this.managerService.getManagerByIdOrEmail(id);

    const isMatched = await this.passwordService.comparePasswords(body.oldPassword, manager.password);

    if (!isMatched) {
      throw new UnauthorizedException('Wrong old password!');
    }

    if (body.oldPassword === body.newPassword) {
      throw new BadRequestException('New password must be different from the old password');
    }

    const hashedPassword = await this.passwordService.hashPassword(body.newPassword);

    await this.managerService.updateManager(id, {password: hashedPassword});
  }

  async sendForgotPasswordToken(email: string): Promise<void> {
    const manager = await this.managerService.getManagerByIdOrEmail(email);

    const forgotPasswordToken = await this.tokenService.generateActionToken(manager.id, EActionTokenType.forgot);

    await this.mailService.sendManagerForgotPassword(manager, forgotPasswordToken);
  }

  async setForgotPassword(id: string, password: string): Promise<Manager> {
    return this.managerService.updateManager(id, {password});
  }
}
