import { Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import {
  AccessStrategy,
  ActivateStrategy,
  ForgotStrategy,
  RefreshStrategy,
} from './bearer.strategy';
import { AuthModule } from './auth.module';

@Global()
@Module({
  imports: [
    AuthModule,
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
    JwtModule.register({
      secret: process.env.SECRET_ACTIVATE_WORD,
      signOptions: {
        expiresIn: '1d',
      },
    }),
    JwtModule.register({
      secret: process.env.SECRET_FORGOT_PASSWORD_WORD,
      signOptions: {
        expiresIn: '30m',
      },
    }),
  ],
  providers: [
    AccessStrategy,
    RefreshStrategy,
    ActivateStrategy,
    ForgotStrategy,
  ],
  exports: [PassportModule],
})
export class PassportWrapperModule {}
