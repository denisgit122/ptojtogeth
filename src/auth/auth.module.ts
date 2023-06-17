import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AdminModule, AdminService } from '../admin';
import { PassportModule } from '@nestjs/passport';
import { BearerStrategy } from './bearer.strategy';

@Module({
  imports: [
    AdminModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  providers: [AuthService, AdminService, BearerStrategy],
  exports: [AuthService],
})
export class AuthModule {}
