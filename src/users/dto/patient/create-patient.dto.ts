import { Type } from 'class-transformer';
import { IsDate, IsString, ValidateIf } from 'class-validator';
import { Role } from '../../entities/user.entity';

export class CreatePatientDto {
  @IsString()
  @ValidateIf((o) => o.role === Role.PATIENT)
  address?: string;

  @IsDate()
  @Type(() => Date)
  @ValidateIf((o) => o.role === Role.PATIENT)
  birthday?: string;
}
