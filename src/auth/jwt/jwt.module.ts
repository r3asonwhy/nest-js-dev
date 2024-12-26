import { JwtConfigModule } from '@/config/jwt/config.module';
import { JwtConfigService } from '@/config/jwt/config.service';
import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtConfigModule,
    NestJwtModule.registerAsync({
      imports: [JwtConfigModule],
      inject: [JwtConfigService],
      useFactory: async (jwtConfigService: JwtConfigService) => ({
        secret: jwtConfigService.secret,
        signOptions: { expiresIn: jwtConfigService.accessTokenTtl },
      }),
    }),
  ],
  exports: [NestJwtModule],
})
export class JwtModule {}
