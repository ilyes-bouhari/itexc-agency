import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrescriptionItem } from './entities/prescription-item.entity';
import { PrescriptionItemsController } from './prescription-items.controller';
import { PrescriptionItemsService } from './prescription-items.service';
import { PrescriptionsService } from '../prescriptions.service';
import { Patient } from 'src/users/entities/patient.entity';
import { Prescription } from '../entities/prescription.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Patient, Prescription, PrescriptionItem]),
  ],
  controllers: [PrescriptionItemsController],
  providers: [PrescriptionItemsService, PrescriptionsService],
})
export class PrescriptionItemsModule {}
