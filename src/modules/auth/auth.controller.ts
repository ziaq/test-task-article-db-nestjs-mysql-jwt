import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';

import { UserId } from '../common/user-id.decorator';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { AuthService } from './auth.service';
import { AccessTokenResponseDto } from './dto/access-token-response.dto';
import { LoginRequestDto } from './dto/login-request.dto';
import { LogoutResponseDto } from './dto/logout-response.dto';
import { RefreshTokenRequestDto } from './dto/refresh-token-request.dto';
import { RegisterRequestDto } from './dto/register-request.dto';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { ReqWithCookie } from './types/req-with-cookie.type';
import { getRefreshTokenExpiration } from './utils/get-refresh-token-expiration';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: 'Регистрация нового пользователя',
  })
  @ApiBody({ type: RegisterRequestDto })
  @ApiResponse({ status: 201, type: UserResponseDto })
  @Post('register')
  async register(@Body() body: RegisterRequestDto): Promise<UserResponseDto> {
    return this.authService.registerUser(body);
  }

  @ApiOperation({
    summary: 'Авторизация на сервисе',
  })
  @ApiBody({ type: LoginRequestDto })
  @ApiResponse({ type: AccessTokenResponseDto })
  @Post('login')
  async login(
    @Body() body: LoginRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AccessTokenResponseDto> {
    const { email, password, fingerprint } = body;

    const user = await this.authService.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const { accessToken, refreshToken } = await this.authService.generateTokens(
      user.id,
      fingerprint,
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      expires: getRefreshTokenExpiration(),
    });

    return { accessToken };
  }

  @ApiCookieAuth('refreshToken')
  @ApiOperation({
    summary: 'Выход из аккаунта',
    description: 'Удаление refresh токена из базы, отчистка cookie',
  })
  @ApiResponse({ type: LogoutResponseDto })
  @UseGuards(RefreshTokenGuard)
  @Post('logout')
  async logout(
    @UserId() userId: number,
    @Req() req: ReqWithCookie,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LogoutResponseDto> {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found in cookies');
    }

    await this.authService.removeRefreshToken(userId, refreshToken);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    return { message: 'Logged out successfully' };
  }

  @ApiCookieAuth('refreshToken')
  @ApiOperation({
    summary: 'Обновление access токена по refresh токену из cookie',
  })
  @ApiBody({ type: RefreshTokenRequestDto })
  @ApiResponse({ type: AccessTokenResponseDto })
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refresh(
    @UserId() userId: number,
    @Res({ passthrough: true }) res: Response,
    @Body() body: RefreshTokenRequestDto,
  ): Promise<AccessTokenResponseDto> {
    const { accessToken, refreshToken } = await this.authService.generateTokens(
      userId,
      body.fingerprint,
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      expires: getRefreshTokenExpiration(),
    });

    return { accessToken };
  }
}
