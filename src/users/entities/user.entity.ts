import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Doctor } from './doctor.entity';
import { Patient } from './patient.entity';

export enum Role {
  ADMIN = 'ADMIN',
  DOCTOR = 'DOCTOR',
  ADMINISTRATIVE_STAFF = 'ADMINISTRATIVE_STAFF',
  PATIENT = 'PATIENT',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: Role })
  role: Role;

  @Column()
  @Exclude()
  password: string;

  @OneToOne(() => Patient, (patient) => patient.user)
  patient?: Patient;

  @OneToOne(() => Doctor, (doctor) => doctor.user)
  doctor?: Doctor;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
