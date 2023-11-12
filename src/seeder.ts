import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { seeder } from 'nestjs-seeder';
import { PasswordService } from './auth/password.service';
import { MedicalHistoryModule } from './medical-history/medical-history.module';
import { PrescriptionsModule } from './prescriptions/prescriptions.module';
import { Doctor } from './users/entities/doctor.entity';
import { Patient } from './users/entities/patient.entity';
import { User } from './users/entities/user.entity';
import { UsersSeeder } from './users/seeders/users.seeder';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';

seeder({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Patient, Doctor]),
    UsersModule,
    MedicalHistoryModule,
    PrescriptionsModule,
  ],
  providers: [UsersService, PasswordService],
}).run([UsersSeeder]);
