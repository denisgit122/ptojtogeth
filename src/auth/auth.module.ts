import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AdminModule, AdminService } from '../admin';
import { PassportModule } from '@nestjs/passport';
import {
  AccessStrategy,
  ActivateStrategy,
  ForgotStrategy,
  RefreshStrategy,
} from './bearer.strategy';
import { ManagerModule, ManagerService } from '../manager';
import {
  MailModule,
  MailService,
  PasswordModule,
  TokenModule,
  TokenService,
} from '../core';
import { AuthController } from './auth.controller';
import { OrderModule, OrderService } from '../order';

@Module({
  imports: [
    PassportModule,
    PasswordModule,
    AdminModule,
    ManagerModule,
    MailModule,
    TokenModule,
    OrderModule,
    JwtModule.register({
      secret: process.env.SECRET_ACCESS_WORD,
      signOptions: {
        expiresIn: '10m',
      },
    }),
    JwtModule.register({
      secret: process.env.SECRET_REFRESH_WORD,
      signOptions: {
        expiresIn: '20m',
      },
    }),
    JwtModule.register({
      secret: process.env.SECRET_ACTIVATE_WORD,
      signOptions: {
        expiresIn: '1d',
      },
    }),
    JwtModule.register({
      secret: process.env.SECRET_FORGOT_PASSWORD_WORD,
      signOptions: {
        expiresIn: '30m',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AdminService,
    AccessStrategy,
    RefreshStrategy,
    ManagerService,
    MailService,
    ActivateStrategy,
    TokenService,
    ForgotStrategy,
    OrderService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
