import { Prescription } from 'src/prescriptions/entities/prescription.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'prescription-items' })
export class PrescriptionItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  medication: string;

  @Column()
  dosage: string;

  @Column()
  frequency: string;

  @Column({ type: 'date' })
  startAt: Date;

  @Column({ type: 'date' })
  endAt: Date;

  @ManyToOne(
    () => Prescription,
    (prescription) => prescription.prescriptionItems,
    { onDelete: 'CASCADE', nullable: false },
  )
  prescription: Prescription;
}
