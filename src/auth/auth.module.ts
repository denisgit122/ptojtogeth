import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AdminModule, AdminService } from '../admin';
import { PassportModule } from '@nestjs/passport';
import { AccessStrategy, RefreshStrategy } from './bearer.strategy';

@Module({
  imports: [
    AdminModule,
    PassportModule,
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
  providers: [AuthService, AdminService, AccessStrategy, RefreshStrategy],
  exports: [AuthService],
})
export class AuthModule {}
