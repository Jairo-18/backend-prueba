import { RoleType } from '../../shared/entities/roleType.entity';
import { BaseResponseDto } from './../../shared/dtos/response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import {
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ParamsPaginationDto } from 'src/shared/dtos/pagination.dto';

export interface CreateUserRelatedDataDto {
  roleType?: RoleType[];
}

export class CreateUserRelatedDataReponseDto implements BaseResponseDto {
  @ApiProperty({
    type: Number,
    example: HttpStatus.OK,
  })
  statusCode: number;
  @ApiProperty({
    type: Object,
    example: 'Data relacionada para creación y registro del usuario',
  })
  data: CreateUserRelatedDataDto;
}

export class PaginatedListUsersParamsDto extends ParamsPaginationDto {
  @ApiProperty({
    example: '1120066430',
    required: false,
  })
  @IsOptional()
  @IsString()
  identificationNumber?: string;

  @ApiProperty({
    example: 'Jhon',
    required: false,
  })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({
    example: 'test@gmail.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: '1990-01-15',
    required: false,
    description: 'Fecha de nacimiento en formato YYYY-MM-DD',
  })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiProperty({
    example: '2023-01-01T10:00:00Z',
    required: false,
    description:
      'Fecha y hora de creación en formato ISO 8601 (ej. YYYY-MM-DDTHH:mm:ssZ)',
  })
  @IsOptional()
  @IsDateString()
  createdAt?: string;

  @ApiProperty({
    example: 'uuid-del-rol',
    description: 'UUID del rol',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  roleType?: string;
}
