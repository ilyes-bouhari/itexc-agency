import { IntersectionType } from '@nestjs/mapped-types';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { IsUnique } from 'src/common/validators/is-unique';
import { Role, User } from '../entities/user.entity';
import { CreatePatientDto } from './patient/create-patient.dto';
import { CreateDoctorDto } from './doctor/create-doctor.dto';

export class CreateUserDto extends IntersectionType(
  CreatePatientDto,
  CreateDoctorDto,
) {
  @IsString()
  name: string;

  @IsEmail()
  @IsUnique({ context: { entity: User } })
  email: string;

  @MinLength(10)
  password: string;

  @IsEnum(Role)
  role: Role;
}
