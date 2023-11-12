import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class ParseUserPipe implements PipeTransform {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async transform(value: any) {
    const user = await this.usersRepository.findOne({
      where: { id: value },
    });

    if (!user) {
      throw new NotFoundException(`User #${value} not found`);
    }

    return user;
  }
}
