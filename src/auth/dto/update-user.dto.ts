import { IntersectionType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { IsUnique } from 'src/common/validators/is-unique';
import { CreateDoctorDto } from 'src/users/dto/doctor/create-doctor.dto';
import { CreatePatientDto } from 'src/users/dto/patient/create-patient.dto';
import { Role, User } from 'src/users/entities/user.entity';

export class UpdateUserDto extends IntersectionType(
  CreatePatientDto,
  CreateDoctorDto,
) {
  @IsString()
  id: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsEmail()
  @IsUnique({ context: { entity: User, ignoreId: true } })
  @IsOptional()
  email: string;

  @MinLength(10)
  @IsOptional()
  password: string;

  @IsOptional()
  @IsEnum(Role)
  role: Role;
}
