import { UserResponseDto } from '../dto/user-response.dto';
import { User } from '../entities/user.entity';

export function mapToUserResponseDto(user: User): UserResponseDto {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  };
}
