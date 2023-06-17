import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from '../core';
import { AdminService } from './admin.service';

@Module({
  imports: [PrismaModule],
  providers: [AdminService, PrismaService],
  exports: [AdminService],
})
export class AdminModule {}
