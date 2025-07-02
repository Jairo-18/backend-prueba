import { GET_USER_EXAMPLE } from './../constants/examples.conts';
import { User } from './../../shared/entities/user.entity';
import { BaseResponseDto } from './../../shared/dtos/response.dto';
import { NOT_EMPTY_MESSAGE_ID } from './../../shared/constants/validator-messages.const';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  ValidateIf,
  IsDateString,
} from 'class-validator';
import { HttpStatus } from '@nestjs/common';
import { GET_ALL_USER_EXAMPLE } from '../constants/examples.conts';

export class CreateUserDto {
  @ApiProperty({
    example: 'Id de usuario - uuid',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty({ message: NOT_EMPTY_MESSAGE_ID })
  userId: string;

  @ApiProperty({
    example: '1120066430',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'El número de identificación es requerido' })
  identificationNumber: string;

  @ApiProperty({
    example: 'Jhon',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  fullName: string;

  @ApiProperty({
    example: 'test@gmail.com',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty({ message: 'El email es requerido' })
  email: string;

  @ApiProperty({
    example: '1990-05-15',
    description: 'Fecha de nacimiento en formato YYYY-MM-DD',
    required: false,
  })
  @IsOptional()
  @IsDateString(
    {},
    {
      message: 'La fecha de nacimiento debe tener formato válido (YYYY-MM-DD)',
    },
  )
  dateOfBirth?: string;

  @ApiProperty({
    example: 'Test@123',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  password: string;

  @ApiProperty({
    example: 'Test@123',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'La confirmación de contraseña es requerida' })
  confirmPassword: string;

  @ApiProperty({
    example: 'UUID DEL ROL',
    description: 'Rol aignado / uuid',
    required: false,
  })
  @ValidateIf((o) => o.roleType && o.roleType.trim() !== '')
  @IsUUID()
  @IsOptional()
  roleType?: string;
}

export interface GetAllUsersRespose {
  users: User[];
}

export class GetAllUsersResposeDto implements BaseResponseDto {
  @ApiProperty({
    example: HttpStatus.OK,
  })
  statusCode: number;

  @ApiProperty({
    type: Array,
    example: GET_ALL_USER_EXAMPLE,
  })
  data: GetAllUsersRespose;
}

export class GetUserResponseDto implements BaseResponseDto {
  @ApiProperty({
    type: Number,
    example: HttpStatus.OK,
  })
  statusCode: number;
  @ApiProperty({
    type: Object,
    example: GET_USER_EXAMPLE,
  })
  data: Partial<User>;
}

export class UpdateUserDto {
  @ApiProperty({
    example: '1120066430',
    required: false,
  })
  @IsString()
  @IsOptional()
  identificationNumber?: string;

  @ApiProperty({
    example: 'Test Nombre',
    required: false,
  })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiProperty({
    example: 'test@gmail.com',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Debe ser un correo válido' })
  email?: string;

  @ApiProperty({
    example: '1990-05-15',
    description: 'Fecha de nacimiento en formato YYYY-MM-DD',
    required: false,
  })
  @IsOptional()
  @IsDateString(
    {},
    {
      message: 'La fecha de nacimiento debe tener formato válido (YYYY-MM-DD)',
    },
  )
  dateOfBirth?: string;

  @ApiProperty({
    example: 'uuid-del-role',
    description: 'UUID del rol asignado',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'El ID del rol no es válido' })
  roleType?: string;
}
