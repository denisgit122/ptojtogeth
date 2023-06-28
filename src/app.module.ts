import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule, OrdersController, OrdersService } from './orders';
import { MailModule, MailService, PasswordModule, PasswordService, PrismaModule, PrismaService } from "./core";
import {
  AccessStrategy,
  ActivateStrategy,
  AuthController,
  AuthModule,
  AuthService,
  RefreshStrategy,
} from './auth';
import { JwtModule } from '@nestjs/jwt';
import { AdminController, AdminModule, AdminService } from './admin';
import { PassportModule } from '@nestjs/passport';
import {
  ManagersController,
  ManagersModule,
  ManagersService,
} from './managers';

@Module({
  imports: [
    OrdersModule,
    PrismaModule,
    AuthModule,
    PassportModule,
    ManagersModule,
    PasswordModule,
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
    AdminModule,
    MailModule,
  ],
  controllers: [
    AppController,
    OrdersController,
    AuthController,
    AdminController,
    ManagersController,
  ],
  providers: [
    AppService,
    PrismaService,
    AuthService,
    AdminService,
    AccessStrategy,
    RefreshStrategy,
    ManagersService,
    OrdersService,
    MailService,
    PasswordService,
    ActivateStrategy,
  ],
})
export class AppModule {}
