import { Test, TestingModule } from '@nestjs/testing';
import { PrescriptionItemsController } from './prescription-items.controller';
import { PrescriptionItemsService } from './prescription-items.service';

describe('PrescriptionItemsController', () => {
  let controller: PrescriptionItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrescriptionItemsController],
      providers: [PrescriptionItemsService],
    }).compile();

    controller = module.get<PrescriptionItemsController>(PrescriptionItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
