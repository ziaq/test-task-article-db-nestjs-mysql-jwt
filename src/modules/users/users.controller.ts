import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ZodSerializerDto } from 'nestjs-zod';

import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { UserId } from '../common/user-id.decorator';

import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth('access-token')
@UseGuards(AccessTokenGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({
    summary: 'Получение данных пользователя на основе его access токена',
  })
  @ApiResponse({ type: UserResponseDto })
  @ZodSerializerDto(UserResponseDto)
  @Get('my-profile')
  getProfile(@UserId() userId: number) {
    return this.usersService.getUserById(userId);
  }
}
