import { IntersectionType } from '@nestjs/mapped-types';
import { IsEmail, IsString } from 'class-validator';
import { IsUnique } from 'src/common/validators/is-unique';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends IntersectionType(CreateUserDto) {
  @IsString()
  id: string;

  @IsEmail()
  @IsUnique({ context: { entity: User, ignoreId: true } })
  email: string;
}
