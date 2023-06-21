import { Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AccessStrategy, RefreshStrategy } from './bearer.strategy';
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
  ],
  providers: [AccessStrategy, RefreshStrategy],
  exports: [PassportModule],
})
export class PassportWrapperModule {}
