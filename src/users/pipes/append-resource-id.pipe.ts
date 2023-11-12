import {
  Inject,
  Injectable,
  NotFoundException,
  PipeTransform,
  Scope,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class AppendResourceIdPipe implements PipeTransform {
  constructor(
    @Inject(REQUEST) protected readonly request: Request,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async transform(value: any) {
    const user = await this.usersRepository.findOne({
      where: { id: this.request.params.id },
    });

    if (!user) {
      throw new NotFoundException(
        `Resource #${this.request.params.id} not found`,
      );
    }

    value.id = this.request.params.id;

    return value;
  }
}
