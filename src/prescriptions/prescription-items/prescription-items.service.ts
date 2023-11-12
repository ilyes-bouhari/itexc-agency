import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrescriptionsService } from '../prescriptions.service';
import { CreatePrescriptionItemDto } from './dto/create-prescription-item.dto';
import { UpdatePrescriptionItemDto } from './dto/update-prescription-item.dto';
import { PrescriptionItem } from './entities/prescription-item.entity';

@Injectable()
export class PrescriptionItemsService {
  constructor(
    @InjectRepository(PrescriptionItem)
    private readonly prescriptionItemsRepository: Repository<PrescriptionItem>,
    private readonly prescriptionsService: PrescriptionsService,
  ) {}

  async create(
    id: string,
    createPrescriptionItemDto: CreatePrescriptionItemDto,
  ) {
    const prescription = await this.prescriptionsService.findOne(id);
    const prescriptionItem = this.prescriptionItemsRepository.create({
      ...createPrescriptionItemDto,
      prescription,
    });
    await this.prescriptionItemsRepository.save(prescriptionItem);

    return this.findOne(prescriptionItem.id);
  }

  async findOne(id: string) {
    const prescriptionItem = await this.prescriptionItemsRepository.findOne({
      where: { id },
    });

    if (!prescriptionItem) {
      throw new NotFoundException(`Prescription item #${id} not found`);
    }

    return prescriptionItem;
  }

  async update(
    id: string,
    updatePrescriptionItemDto: UpdatePrescriptionItemDto,
  ) {
    await this.findOne(id);

    await this.prescriptionItemsRepository.update(
      id,
      updatePrescriptionItemDto,
    );

    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    this.prescriptionItemsRepository.delete(id);
  }
}
