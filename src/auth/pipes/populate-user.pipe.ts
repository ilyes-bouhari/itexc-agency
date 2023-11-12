import { Inject, Injectable, PipeTransform, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class PopulateUserPipe implements PipeTransform {
  constructor(
    @Inject(REQUEST) protected readonly request: Request,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async transform(value: any) {
    const user = await this.usersRepository.findOne({
      where: { id: (this.request.user as User).id },
    });

    value.id = user.id;
    value.role = user.role;

    return value;
  }
}
