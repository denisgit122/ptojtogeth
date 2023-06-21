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

@Module({
  imports: [
    OrdersModule,
    PrismaModule,
    AuthModule,
    PassportModule,
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
  ],
  providers: [
    AppService,
    OrdersService,
    PrismaService,
    AuthService,
    AdminService,
    AccessStrategy,
    RefreshStrategy,
  ],
})
export class AppModule {}
