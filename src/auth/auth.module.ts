import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AdminModule, AdminService } from '../admin';
import { PassportModule } from '@nestjs/passport';
import { AccessStrategy, ActivateStrategy, RefreshStrategy } from './bearer.strategy';
import { ManagersModule, ManagersService } from '../managers';
import { MailModule, MailService, PasswordModule } from '../core';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    PassportModule,
    PasswordModule,
    AdminModule,
    ManagersModule,
    MailModule,
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
        expiresIn: '7d',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AdminService,
    AccessStrategy,
    RefreshStrategy,
    ManagersService,
    MailService,
    ActivateStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
