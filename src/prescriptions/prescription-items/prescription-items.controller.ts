import {
  Body,
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreatePrescriptionItemDto } from './dto/create-prescription-item.dto';
import { UpdatePrescriptionItemDto } from './dto/update-prescription-item.dto';
import { PrescriptionItemsService } from './prescription-items.service';

@Controller()
export class PrescriptionItemsController {
  constructor(
    private readonly prescriptionItemsService: PrescriptionItemsService,
  ) {}

  @Post('prescriptions/:id/prescription-items')
  create(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() createPrescriptionItemDto: CreatePrescriptionItemDto,
  ) {
    return this.prescriptionItemsService.create(id, createPrescriptionItemDto);
  }

  @Patch('prescription-items/:id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updatePrescriptionItemDto: UpdatePrescriptionItemDto,
  ) {
    return this.prescriptionItemsService.update(id, updatePrescriptionItemDto);
  }

  @Delete('prescription-items/:id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.prescriptionItemsService.remove(id);
  }
}
