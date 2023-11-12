import { IsUUID } from 'class-validator';
import { Exists } from 'src/common/validators/exists';
import { Doctor } from 'src/users/entities/doctor.entity';
import { Patient } from 'src/users/entities/patient.entity';

export class CreatePrescriptionDto {
  @Exists({ context: Patient })
  @IsUUID()
  patient: Patient;

  @Exists({ context: Doctor })
  @IsUUID()
  doctor: Doctor;
}
