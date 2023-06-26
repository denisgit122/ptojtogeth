import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule, OrdersController, OrdersService } from './orders';
import { PrismaModule, PrismaService } from './core';
import {
  AccessStrategy,
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
    AdminModule,
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
    OrdersService,
    PrismaService,
    AuthService,
    AdminService,
    AccessStrategy,
    RefreshStrategy,
    ManagersService,
  ],
})
export class AppModule {}
