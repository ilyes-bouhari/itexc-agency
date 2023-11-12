import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Body } from './decorators/body.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role, User } from './entities/user.entity';
import { AppendResourceIdPipe } from './pipes/append-resource-id.pipe';
import { ParseUserPipe } from './pipes/parse-user.pipe';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.DOCTOR, Role.ADMINISTRATIVE_STAFF)
  @Get()
  findAll(@Request() req) {
    return this.usersService.findAll(req);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.DOCTOR, Role.ADMINISTRATIVE_STAFF)
  @Get(':id')
  findOne(
    @Request() req,
    @Param('id', ParseUUIDPipe, ParseUserPipe) user: User,
  ) {
    const isAdmin = req.user.role === Role.ADMIN;

    if (!isAdmin && user.role !== Role.PATIENT)
      throw new UnauthorizedException();

    return user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.DOCTOR)
  @Put(':id')
  update(
    @Request() req,
    @Param('id', ParseUUIDPipe, ParseUserPipe) user: User,
    @Body(AppendResourceIdPipe) updateUserDto: UpdateUserDto,
  ) {
    const isDoctor = req.user.role === Role.DOCTOR;

    if (
      (isDoctor && user.role !== Role.PATIENT) ||
      (isDoctor && updateUserDto.role && updateUserDto.role !== Role.PATIENT)
    )
      throw new UnauthorizedException();

    return this.usersService.update(user.id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.DOCTOR)
  @Delete(':id')
  remove(
    @Request() req,
    @Param('id', ParseUUIDPipe, ParseUserPipe) user: User,
  ) {
    const isDoctor = req.user.role === Role.DOCTOR;

    if (isDoctor && user.role !== Role.PATIENT)
      throw new UnauthorizedException();

    return this.usersService.remove(user.id);
  }
}
