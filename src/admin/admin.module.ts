import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from '../core';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PasswordModule, PasswordService } from '../core';

@Module({
  imports: [PrismaModule, PasswordModule],
  providers: [AdminService, PrismaService, PasswordService],
  controllers: [AdminController],
  exports: [AdminService],
})
export class AdminModule {}
