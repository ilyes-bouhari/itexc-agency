import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seeder } from 'nestjs-seeder';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { Role, User } from '../entities/user.entity';
import { UsersService } from '../users.service';

@Injectable()
export class UsersSeeder implements Seeder {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly usersService: UsersService,
  ) {}

  async seed(): Promise<any> {
    const data: CreateUserDto[] = [
      {
        name: 'admin',
        email: 'admin@itexc.com',
        password: '1234567890',
        role: Role.ADMIN,
      },
      {
        name: 'doctor',
        email: 'doctor@itexc.com',
        password: '1234567890',
        role: Role.DOCTOR,
        specialization: 'Internal medicine',
      },
      {
        name: 'admin_staff',
        email: 'admin_staff@itexc.com',
        password: '1234567890',
        role: Role.ADMINISTRATIVE_STAFF,
      },
      {
        name: 'patient',
        email: 'patient@itexc.com',
        password: '1234567890',
        role: Role.PATIENT,
        birthday: '2000-10-10',
        address: 'Algiers',
      },
    ];
    const users = await Promise.all(
      data.map((user: CreateUserDto) => this.usersService.create(user)),
    );

    return users;
  }

  async drop(): Promise<any> {
    const users = await this.usersRepository.find();
    await Promise.all(
      users.map((user: User) => this.usersRepository.delete(user.id)),
    );
  }
}
