import { IntersectionType, OmitType } from '@nestjs/mapped-types';
import { IsEmail, IsOptional } from 'class-validator';
import { IsUnique } from 'src/common/validators/is-unique';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';

export class UpdateProfileDto extends IntersectionType(
  OmitType(CreateUserDto, ['password', 'email'] as const),
) {
  @IsOptional()
  id: string;

  @IsEmail()
  @IsUnique({ context: { entity: User, ignoreId: true } })
  email: string;
}
