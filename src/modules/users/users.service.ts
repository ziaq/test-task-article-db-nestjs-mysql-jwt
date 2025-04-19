import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { MyProfileResponseDto } from './dto/my-profile-response.dto';
import { User } from './entities/user.entity';
import { mapToUserResponseDto } from './utils/map-to-user-response-dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async createUser(data: CreateUserRequestDto): Promise<MyProfileResponseDto> {
    const existingUser = await this.getUserWithPassword(data.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = await this.userRepo.save(data);
    return mapToUserResponseDto(user);
  }

  async getUserById(id: number): Promise<MyProfileResponseDto> {
    const user = await this.userRepo.findOne({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');

    return mapToUserResponseDto(user);
  }

  getUserWithPassword(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }
}
