import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from '../core';
import { AuthModule } from '../auth';
import { AdminModule } from '../admin';
import { JwtModule } from '@nestjs/jwt';
import { ManagersController } from './managers.controller';
import { ManagersService } from './managers.service';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    AdminModule,
    JwtModule.register({
      secret: process.env.SECRET_ACCESS_WORD,
      signOptions: {
        expiresIn: '10m',
      },
    }),
  ],
  controllers: [ManagersController],
  providers: [PrismaService, ManagersService],
})
export class ManagersModule {}
