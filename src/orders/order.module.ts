import { Module } from '@nestjs/common';
import { PrismaService, PrismaModule } from '../core';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
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
  controllers: [OrderController],
  providers: [PrismaService, OrderService],
})
export class OrderModule {}
