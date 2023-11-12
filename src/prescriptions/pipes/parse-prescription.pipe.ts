import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prescription } from '../entities/prescription.entity';

@Injectable()
export class ParsePrescriptionPipe implements PipeTransform {
  constructor(
    @InjectRepository(Prescription)
    private readonly prescriptionsRepository: Repository<Prescription>,
  ) {}

  async transform(value: any) {
    const prescription = await this.prescriptionsRepository.findOne({
      where: { id: value },
      relations: { patient: true },
    });

    if (!prescription) {
      throw new NotFoundException(`Prescription #${value} not found`);
    }

    return prescription;
  }
}
