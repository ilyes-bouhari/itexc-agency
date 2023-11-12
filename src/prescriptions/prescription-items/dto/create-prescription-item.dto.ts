import { Type } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';

export class CreatePrescriptionItemDto {
  @IsString()
  medication: string;

  @IsString()
  dosage: string;

  @IsString()
  frequency: string;

  @IsDate()
  @Type(() => Date)
  startAt: Date;

  @IsDate()
  @Type(() => Date)
  endAt: Date;
}
