import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Patient } from 'src/users/entities/patient.entity';
import { PrescriptionItem } from '../prescription-items/entities/prescription-item.entity';
import { Doctor } from 'src/users/entities/doctor.entity';

@Entity({ name: 'prescriptions' })
export class Prescription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Patient, (patient) => patient.prescriptions, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  patient: Patient;

  @ManyToOne(() => Doctor, (doctor) => doctor.prescriptions, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  doctor: Doctor;

  @OneToMany(
    () => PrescriptionItem,
    (prescriptionItem) => prescriptionItem.prescription,
  )
  prescriptionItems: PrescriptionItem[];
}
