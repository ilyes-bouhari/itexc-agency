import { Test, TestingModule } from '@nestjs/testing';
import { PrescriptionItemsService } from './prescription-items.service';

describe('PrescriptionItemsService', () => {
  let service: PrescriptionItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrescriptionItemsService],
    }).compile();

    service = module.get<PrescriptionItemsService>(PrescriptionItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
