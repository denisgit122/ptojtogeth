import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule, OrdersController, OrdersService } from './orders';
import { PrismaModule, PrismaService } from './core';
import {
  AuthController,
  AuthModule,
  AuthService,
  BearerStrategy,
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
      secret: process.env.JWT_SECRET_KEY,
      signOptions: {
        expiresIn: '24h',
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
    BearerStrategy,
  ],
})
export class AppModule {}
