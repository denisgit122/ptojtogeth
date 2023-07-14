import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ChangePasswordDto, LoginDto } from './dto';
import {
  EActionTokenType,
  ITokenPair,
  MailService,
  PasswordService,
  TokenService,
} from '../core';
import { EStatusManager, IManager, ManagerService } from '../manager';

@Injectable()
export class AuthService {
  constructor(
    private readonly mailService: MailService,
    private readonly passwordService: PasswordService,
    private readonly managerService: ManagerService,
    private readonly tokenService: TokenService,
  ) {}

  async login(loginBody: LoginDto): Promise<ITokenPair> {
    const { email, password } = loginBody;

    const manager = await this.managerService.getManagerByIdOrEmail(email);

    if (manager) {
      if (manager.status === EStatusManager.BANNED) {
        throw new HttpException(
          'You cannot log in because your account is banned',
          HttpStatus.FORBIDDEN,
        );
      }

      await this.managerService.updateManager(manager.id, {
        last_login: new Date(),
      });
    } else {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    if (!password) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    const passwordMatches = await this.passwordService.comparePasswords(
      password,
      manager.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    return this.tokenService.generateTokenPair(manager.id);
  }

  async refresh(id: string): Promise<ITokenPair> {
    return this.tokenService.generateTokenPair(id);
  }

  async sendActivateToken(email: string): Promise<void> {
    const manager = await this.managerService.getManagerByIdOrEmail(email);

    if (!manager) {
      throw new HttpException('Manager not found', HttpStatus.NOT_FOUND);
    }

    if (manager.is_active === true) {
      throw new HttpException(
        'Your account is already active',
        HttpStatus.CONFLICT,
      );
    }

    if (manager.status === EStatusManager.BANNED) {
      throw new HttpException('Your account is banned', HttpStatus.CONFLICT);
    }

    const activateToken = await this.tokenService.generateActionToken(
      manager.id,
      EActionTokenType.activate,
    );

    await this.mailService.sendManagerActivate(manager, activateToken);
  }

  async activate(id: string, password: string): Promise<IManager> {
    return this.managerService.updateManager(id, { password, is_active: true });
  }

  async changePassword(
    body: ChangePasswordDto,
    id: string,
  ): Promise<HttpException> {
    const manager = await this.managerService.getManagerByIdOrEmail(id);

    const isMatched = await this.passwordService.comparePasswords(
      body.oldPassword,
      manager.password,
    );

    if (!isMatched) {
      throw new UnauthorizedException('Wrong old password!');
    }

    if (body.oldPassword === body.newPassword) {
      throw new BadRequestException(
        'New password must be different from the old password',
      );
    }

    const hashedPassword = await this.passwordService.hashPassword(
      body.newPassword,
    );

    await this.managerService.updateManager(id, { password: hashedPassword });

    return new HttpException('The password has been changed', HttpStatus.OK);
  }

  async sendForgotPasswordToken(email: string): Promise<void> {
    const manager = await this.managerService.getManagerByIdOrEmail(email);

    const forgotPasswordToken = await this.tokenService.generateActionToken(
      manager.id,
      EActionTokenType.forgot,
    );

    await this.mailService.sendManagerForgotPassword(
      manager,
      forgotPasswordToken,
    );
  }

  async setForgotPassword(
    id: string,
    password: string,
  ): Promise<HttpException> {
    const manager = await this.managerService.getManagerByIdOrEmail(id);

    const passwordMatched = await this.passwordService.comparePasswords(
      password,
      manager.password,
    );

    if (passwordMatched) {
      throw new BadRequestException(
        'New password must be different from the old password',
      );
    }

    await this.managerService.updateManager(id, { password });

    return new HttpException('The password has been changed', HttpStatus.OK);
  }
}
