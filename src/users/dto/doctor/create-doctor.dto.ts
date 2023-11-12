import { IsString, ValidateIf } from 'class-validator';
import { Role } from '../../entities/user.entity';

export class CreateDoctorDto {
  @IsString()
  @ValidateIf((o) => o.role === Role.DOCTOR)
  specialization?: string;
}
