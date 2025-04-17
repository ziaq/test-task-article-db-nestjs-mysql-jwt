import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../users/users.module';

import { RefreshSession } from './entities/refresh-session.entity';
import { AccessTokenGuard } from './guards/access-token.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([RefreshSession]),
    JwtModule.register({}),
    UsersModule,
  ],
  providers: [
    AuthService,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    AccessTokenGuard,
    RefreshTokenGuard,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
