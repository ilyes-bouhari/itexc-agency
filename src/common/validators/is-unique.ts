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
import { DataSource, Not } from 'typeorm';

@ValidatorConstraint({ name: 'isUnique', async: true })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private readonly dataSource: DataSource) {}

  async validate(
    value: any,
    validationArguments: ValidationArguments,
  ): Promise<boolean> {
    if (value === undefined) return true;

    const exists = await this.dataSource
      .getRepository(validationArguments.constraints[0].entity)
      .findOne({
        where: {
          [validationArguments.property]: value,
          ...(validationArguments.constraints[0].ignoreId
            ? { id: Not((validationArguments.object as any).id) }
            : {}),
        },
      });

    if (exists instanceof validationArguments.constraints[0].entity)
      return false;

    return true;
  }

  defaultMessage?({ property }: ValidationArguments): string {
    return `${property} already exists`;
  }
}

interface CustomValidationOptions extends ValidationOptions {
  context: {
    entity:
      | typeof User
      | typeof Doctor
      | typeof Patient
      | typeof Prescription
      | typeof PrescriptionItem;
    ignoreId?: boolean;
  };
}

export function IsUnique(validationOptions?: CustomValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [validationOptions.context],
      validator: IsUniqueConstraint,
    });
  };
}
