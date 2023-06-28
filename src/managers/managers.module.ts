import { Module } from '@nestjs/common';
import {
  PasswordModule,
  PasswordService,
  PrismaModule,
  PrismaService,
} from '../core';
import { JwtModule } from '@nestjs/jwt';
import { ManagersController } from './managers.controller';
import { ManagersService } from './managers.service';

@Module({
  imports: [
    PrismaModule,
    PasswordModule,
    JwtModule.register({
      secret: process.env.SECRET_ACCESS_WORD,
      signOptions: {
        expiresIn: '10m',
      },
    }),
  ],
  controllers: [ManagersController],
  providers: [PrismaService, ManagersService, PasswordService],
})
export class ManagersModule {}
