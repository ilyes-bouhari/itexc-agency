import { Injectable, NotFoundException, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordService } from 'src/auth/password.service';
import { removeNull } from 'src/common/helpers/functions';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateDoctorDto } from './dto/doctor/create-doctor.dto';
import { CreatePatientDto } from './dto/patient/create-patient.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Doctor } from './entities/doctor.entity';
import { Patient } from './entities/patient.entity';
import { Role, User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Doctor)
    private readonly doctorsRepository: Repository<Doctor>,
    @InjectRepository(Patient)
    private readonly patientsRepository: Repository<Patient>,
    private readonly passwordService: PasswordService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create({
      ...createUserDto,
      password: await this.passwordService.hash(createUserDto.password),
    });
    await this.usersRepository.save(user);

    if (createUserDto.role === Role.PATIENT) {
      const patient = this.patientsRepository.create({
        address: createUserDto.address,
        birthday: createUserDto.birthday,
        user,
      });
      await this.patientsRepository.save(patient);
    } else if (createUserDto.role === Role.DOCTOR) {
      const doctor = this.doctorsRepository.create({
        specialization: createUserDto.specialization,
        user,
      });
      await this.doctorsRepository.save(doctor);
    }

    return this.usersRepository.findOne({
      where: { id: user.id },
      relations: {
        doctor: createUserDto.role === Role.DOCTOR,
        patient: createUserDto.role === Role.PATIENT,
      },
    });
  }

  findAll(@Request() { user }) {
    const isAdmin = user.role === Role.ADMIN;
    return this.usersRepository.find({
      ...(!isAdmin ? { where: { role: Role.PATIENT } } : {}),
      relations: { patient: true, doctor: true },
    });
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: { patient: true, doctor: true },
    });

    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    if (updateUserDto.role && user.role !== updateUserDto.role) {
      if (user.role === Role.DOCTOR) {
        await this.doctorsRepository.delete(user.doctor.id);
        await this.createPatientOrDoctor(updateUserDto, user);
      } else if (user.role === Role.PATIENT) {
        await this.patientsRepository.delete(user.patient.id);
        await this.createPatientOrDoctor(updateUserDto, user);
      } else {
        await this.createPatientOrDoctor(updateUserDto, user);
      }
    } else {
      if (user.role === Role.DOCTOR) {
        await this.doctorsRepository.update(user.doctor.id, {
          specialization: updateUserDto.specialization,
        });
      } else if (user.role === Role.PATIENT) {
        await this.patientsRepository.update(user.patient.id, {
          birthday: updateUserDto.birthday,
          address: updateUserDto.address,
        });
      }
    }

    await this.usersRepository.update(
      id,
      removeNull({
        name: updateUserDto.name,
        email: updateUserDto.email,
        role: updateUserDto.role,
        password: updateUserDto.password
          ? await this.passwordService.hash(updateUserDto.password)
          : null,
      }),
    );

    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    this.usersRepository.delete(id);
  }

  createPatient(createPatientDto: CreatePatientDto, user: User) {
    const patient = this.patientsRepository.create({
      ...createPatientDto,
      user,
    });
    return this.patientsRepository.save(patient);
  }

  createDoctor(createDoctorDto: CreateDoctorDto, user: User) {
    const doctor = this.doctorsRepository.create({
      ...createDoctorDto,
      user,
    });
    return this.doctorsRepository.save(doctor);
  }

  createPatientOrDoctor(updateUserDto: UpdateUserDto, user: User) {
    if (updateUserDto.role === Role.PATIENT)
      return this.createPatient(
        {
          birthday: updateUserDto.birthday,
          address: updateUserDto.address,
        },
        user,
      );
    else if (updateUserDto.role === Role.DOCTOR)
      return this.createDoctor(
        { specialization: updateUserDto.specialization },
        user,
      );
  }
}
