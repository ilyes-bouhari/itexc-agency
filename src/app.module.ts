import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { IsUniqueConstraint } from './common/validators/is-unique';
import { UsersModule } from './users/users.module';
import { MedicalHistoryModule } from './medical-history/medical-history.module';
import { PrescriptionsModule } from './prescriptions/prescriptions.module';
import { ExistsConstraint } from './common/validators/exists';

@Module({
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
        synchronize:
          configService.get('NODE_ENV') === 'development' ? true : false,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    MedicalHistoryModule,
    PrescriptionsModule,
  ],
  controllers: [AppController],
  providers: [AppService, IsUniqueConstraint, ExistsConstraint],
})
export class AppModule {}
