import { Doctor } from 'src/users/entities/doctor.entity';
import { Patient } from 'src/users/entities/patient.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'medical-history' })
export class MedicalHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Patient, (patient) => patient.medicalHistory, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  patient: Patient;

  @ManyToOne(() => Doctor, (doctor) => doctor.medicalHistory, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  doctor: Doctor;

  @Column('text')
  diagnosis: string;

  @Column('text')
  treatment: string;

  @Column('text')
  notes: string;
}
