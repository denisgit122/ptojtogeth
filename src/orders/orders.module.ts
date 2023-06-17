import { Module } from '@nestjs/common';
import { PrismaService, PrismaModule } from '../core';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { AuthModule } from '../auth';
import { AdminModule, AdminService } from '../admin';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    AdminModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  controllers: [OrdersController],
  providers: [PrismaService, OrdersService, AdminService],
})
export class OrdersModule {}
