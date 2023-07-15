import { Module } from '@nestjs/common';
import {
  PasswordModule,
  PasswordService,
  PrismaModule,
  PrismaService,
} from '../core';
import { JwtModule } from '@nestjs/jwt';
import { ManagerController } from './manager.controller';
import { ManagerService } from './manager.service';
import { OrderModule, OrderService } from '../order';

@Module({
  imports: [
    PrismaModule,
    PasswordModule,
    OrderModule,
    JwtModule.register({
      secret: process.env.SECRET_ACCESS_WORD,
      signOptions: {
        expiresIn: '10m',
      },
    }),
  ],
  controllers: [ManagerController],
  providers: [PrismaService, ManagerService, PasswordService, OrderService],
})
export class ManagerModule {}
