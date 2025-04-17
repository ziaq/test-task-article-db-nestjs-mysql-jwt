import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async create(data: CreateUserRequestDto): Promise<UserResponseDto> {
    const existingUser = await this.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = await this.userRepo.save(data);
    return user;
  }

  async findById(id: number): Promise<UserResponseDto> {
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

    return user;
  }

  findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }
}
