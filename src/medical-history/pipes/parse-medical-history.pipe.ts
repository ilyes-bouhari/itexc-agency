import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicalHistory } from '../entities/medical-history.entity';

@Injectable()
export class ParseMedicalHistoryPipe implements PipeTransform {
  constructor(
    @InjectRepository(MedicalHistory)
    private readonly medicalHistorysRepository: Repository<MedicalHistory>,
  ) {}

  async transform(value: any) {
    const medicalHistory = await this.medicalHistorysRepository.findOne({
      where: { id: value },
      relations: { patient: true },
    });

    if (!medicalHistory) {
      throw new NotFoundException(`User #${value} not found`);
    }

    return medicalHistory;
  }
}
