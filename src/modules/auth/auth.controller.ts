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
import { ZodSerializerDto } from 'nestjs-zod';

import { UserId } from '../common/user-id.decorator';
import { MyProfileResponseDto } from '../users/dto/my-profile-response.dto';
import { ApiCommonErrors } from '../common/api-common-errors.decorator';

import { AccessTokenResponseDto } from './dto/access-token-response.dto';
import { LoginRequestDto } from './dto/login-request.dto';
import { LogoutResponseDto } from './dto/logout-response.dto';
import { RefreshTokenRequestDto } from './dto/refresh-token-request.dto';
import { RegisterRequestDto } from './dto/register-request.dto';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { ReqWithCookie } from './types/req-with-cookie.type';
import { getRefreshTokenExpiration } from './utils/get-refresh-token-expiration';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: 'Регистрация нового пользователя',
  })
  @ApiBody({ type: RegisterRequestDto })
  @ApiResponse({ status: 201, type: MyProfileResponseDto })
  @ApiCommonErrors(400, 409)
  @ZodSerializerDto(MyProfileResponseDto)
  @Post('register')
  register(@Body() body: RegisterRequestDto): Promise<MyProfileResponseDto> {
    return this.authService.registerUser(body);
  }

  @ApiOperation({
    summary: 'Авторизация на сервисе',
  })
  @ApiBody({ type: LoginRequestDto })
  @ApiResponse({ status: 200, type: AccessTokenResponseDto })
  @ApiCommonErrors(400, 401)
  @ZodSerializerDto(AccessTokenResponseDto)
  @Post('login')
  async login(
    @Body() body: LoginRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AccessTokenResponseDto> {
    const { email, password, fingerprint } = body;

    const userWithPassword = await this.authService.validateUser(
      email,
      password,
    );
    if (!userWithPassword)
      throw new UnauthorizedException('Invalid credentials');

    const { accessToken, refreshToken } = await this.authService.generateTokens(
      userWithPassword.id,
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
  @ApiResponse({ status: 200, type: LogoutResponseDto })
  @ApiCommonErrors(400, 401)
  @UseGuards(RefreshTokenGuard)
  @ZodSerializerDto(LogoutResponseDto)
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
  @ApiResponse({ status: 200, type: AccessTokenResponseDto })
  @ApiCommonErrors(401)
  @UseGuards(RefreshTokenGuard)
  @ZodSerializerDto(AccessTokenResponseDto)
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
