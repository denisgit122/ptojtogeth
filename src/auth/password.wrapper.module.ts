import { Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { BearerStrategy } from './bearer.strategy';
import { AuthModule } from './auth.module';

@Global()
@Module({
  imports: [
    AuthModule,
    PassportModule.register({ defaultStrategy: 'Bearer' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  providers: [BearerStrategy],
  exports: [PassportModule],
})
export class PassportWrapperModule {}
