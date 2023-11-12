import { Injectable, NotFoundException, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateMedicalHistoryDto } from './dto/create-medical-history.dto';
import { UpdateMedicalHistoryDto } from './dto/update-medical-history.dto';
import { MedicalHistory } from './entities/medical-history.entity';

@Injectable()
export class MedicalHistoryService {
  constructor(
    @InjectRepository(MedicalHistory)
    private readonly medicalHistoryRepository: Repository<MedicalHistory>,
  ) {}

  create(createMedicalHistoryDto: CreateMedicalHistoryDto) {
    const medicalHistory = this.medicalHistoryRepository.create(
      createMedicalHistoryDto,
    );

    return this.medicalHistoryRepository.save(medicalHistory);
  }

  findAll(@Request() { user }) {
    const isPatient = user.role === Role.PATIENT;
    return this.medicalHistoryRepository.find({
      ...(isPatient ? { where: { patient: { id: user.patient.id } } } : {}),
      relations: ['doctor.user', 'patient.user'],
    });
  }

  async findOne(id: string) {
    const medicalHistory = await this.medicalHistoryRepository.findOne({
      where: { id },
      relations: ['doctor.user', 'patient.user'],
    });

    if (!medicalHistory) {
      throw new NotFoundException(`Medical history #${id} not found`);
    }

    return medicalHistory;
  }

  async update(id: string, updateMedicalHistoryDto: UpdateMedicalHistoryDto) {
    await this.findOne(id);
    await this.medicalHistoryRepository.update(id, updateMedicalHistoryDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    this.medicalHistoryRepository.delete(id);
  }
}
