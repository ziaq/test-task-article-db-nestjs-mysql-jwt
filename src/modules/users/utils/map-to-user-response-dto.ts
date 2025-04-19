import { MyProfileResponseDto } from '../dto/my-profile-response.dto';
import { User } from '../entities/user.entity';

export function mapToUserResponseDto(user: User): MyProfileResponseDto {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  };
}
