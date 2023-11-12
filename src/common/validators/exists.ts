import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { PrescriptionItem } from 'src/prescriptions/entities/prescription-item.entity';
import { Prescription } from 'src/prescriptions/entities/prescription.entity';
import { Doctor } from 'src/users/entities/doctor.entity';
import { Patient } from 'src/users/entities/patient.entity';
import { User } from 'src/users/entities/user.entity';
import { DataSource } from 'typeorm';
import { UUIDv4 } from 'uuid-v4-validator';

@ValidatorConstraint({ name: 'exists', async: true })
@Injectable()
export class ExistsConstraint implements ValidatorConstraintInterface {
  constructor(private readonly dataSource: DataSource) {}

  async validate(
    value: any,
    validationArguments: ValidationArguments,
  ): Promise<boolean> {
    if (value === undefined || !UUIDv4.validate(value)) return true;

    const exists = await this.dataSource
      .getRepository(validationArguments.constraints[0])
      .findOne({ where: { id: value } });

    if (!(exists instanceof validationArguments.constraints[0])) return false;

    return true;
  }

  defaultMessage?({ constraints }: ValidationArguments): string {
    return `${
      constraints[0].name.charAt(0).toUpperCase() + constraints[0].name.slice(1)
    } id not found`;
  }
}

interface CustomValidationOptions extends ValidationOptions {
  context:
    | typeof User
    | typeof Doctor
    | typeof Patient
    | typeof Prescription
    | typeof PrescriptionItem;
}

export function Exists(validationOptions?: CustomValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [validationOptions.context],
      validator: ExistsConstraint,
    });
  };
}
