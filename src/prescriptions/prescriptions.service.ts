import { Injectable, NotFoundException, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { Prescription } from './entities/prescription.entity';
import { Role } from 'src/users/entities/user.entity';

@Injectable()
export class PrescriptionsService {
  constructor(
    @InjectRepository(Prescription)
    private readonly prescriptionsRepository: Repository<Prescription>,
  ) {}

  async create(createPrescriptionDto: CreatePrescriptionDto) {
    const prescription = this.prescriptionsRepository.create(
      createPrescriptionDto,
    );
    await this.prescriptionsRepository.save(prescription);

    return this.findOne(prescription.id);
  }

  findAll(@Request() { user }) {
    const isPatient = user.role === Role.PATIENT;
    return this.prescriptionsRepository.find({
      ...(isPatient ? { where: { patient: { id: user.patient.id } } } : {}),
      relations: ['doctor.user', 'patient.user', 'prescriptionItems'],
    });
  }

  async findOne(id: string) {
    const prescription = await this.prescriptionsRepository.findOne({
      where: { id },
      relations: ['doctor.user', 'patient.user', 'prescriptionItems'],
    });

    if (!prescription) {
      throw new NotFoundException(`Prescription #${id} not found`);
    }

    return prescription;
  }

  async update(id: string, updatePrescriptionDto: UpdatePrescriptionDto) {
    await this.findOne(id);
    await this.prescriptionsRepository.update(id, updatePrescriptionDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    this.prescriptionsRepository.delete(id);
  }
}
