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
  ],
  controllers: [OrdersController],
  providers: [PrismaService, OrdersService, AdminService],
})
export class OrdersModule {}
