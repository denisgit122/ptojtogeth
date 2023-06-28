import { Module } from '@nestjs/common';
import { PrismaService, PrismaModule } from '../core';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.SECRET_ACCESS_WORD,
      signOptions: {
        expiresIn: '10m',
      },
    }),
  ],
  controllers: [OrdersController],
  providers: [PrismaService, OrdersService],
})
export class OrdersModule {}
