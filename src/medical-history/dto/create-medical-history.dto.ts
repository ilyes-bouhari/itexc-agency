import { IsString, IsUUID } from 'class-validator';
import { Exists } from 'src/common/validators/exists';
import { Doctor } from 'src/users/entities/doctor.entity';
import { Patient } from 'src/users/entities/patient.entity';

export class CreateMedicalHistoryDto {
  @Exists({ context: Patient })
  @IsUUID()
  patient: Patient;

  @Exists({ context: Doctor })
  @IsUUID()
  doctor: Doctor;

  @IsString()
  diagnosis: string;

  @IsString()
  treatment: string;

  @IsString()
  notes: string;
}
