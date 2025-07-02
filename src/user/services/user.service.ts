import { INVALID_ACCESS_DATA_MESSAGE } from './../../auth/constants/messages.constants';
import { NOT_FOUND_MESSAGE } from './../../shared/constants/messages.constant';
import { RoleTypeRepository } from './../../shared/repositories/roleType.repository';
import { UserFiltersModel } from './../models/user.model';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { UserRepository } from '../../shared/repositories/user.repository';
import { User } from '../../shared/entities/user.entity';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Not } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _roleTypeRepository: RoleTypeRepository,
  ) {}

  async create(user: CreateUserDto): Promise<{ rowId: string }> {
    // Validación por email
    const existingUserByEmail = await this._userRepository.findOne({
      where: { email: user.email },
    });

    if (existingUserByEmail) {
      throw new HttpException('El email ya está en uso', HttpStatus.CONFLICT);
    }

    // Validación por tipo + número de identificación
    const existingUserByIdentification = await this._userRepository.findOne({
      where: {
        identificationNumber: user.identificationNumber,
      },
    });

    if (existingUserByIdentification) {
      throw new HttpException(
        'El usuario ya existe con esta identificación',
        HttpStatus.CONFLICT,
      );
    }

    this.validatePasswordMatch(user.password, user.confirmPassword);

    const roleType = await this._roleTypeRepository.findOne({
      where: { roleTypeId: user.roleType },
    });

    if (!roleType) {
      throw new HttpException('Rol inválido', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);

    const res = await this._userRepository.insert({
      ...user,
      password: hashedPassword,
      roleType,
    });

    return { rowId: res.identifiers[0].id };
  }

  async register(user: CreateUserDto): Promise<{ rowId: string }> {
    const salt = await bcrypt.genSalt();

    // Validación por email
    const existingUserByEmail = await this._userRepository.findOne({
      where: { email: user.email },
    });

    if (existingUserByEmail) {
      throw new HttpException('El email ya está en uso', HttpStatus.CONFLICT);
    }

    // Validación por tipo + número de identificación
    const existingUserByIdentification = await this._userRepository.findOne({
      where: {
        identificationNumber: user.identificationNumber,
      },
    });

    if (existingUserByIdentification) {
      throw new HttpException(
        'El usuario ya existe con esta identificación',
        HttpStatus.CONFLICT,
      );
    }

    this.validatePasswordMatch(user.password, user.confirmPassword);

    const roleType =
      user.roleType && user.roleType.trim() !== ''
        ? await this._roleTypeRepository.findOne({
            where: { roleTypeId: user.roleType },
          })
        : await this._roleTypeRepository.findOne({
            where: { roleTypeId: '4a96be8d-308f-434f-9846-54e5db3e7d95' },
          });

    if (!roleType) {
      throw new HttpException('Rol inválido', HttpStatus.NOT_FOUND);
    }

    const userConfirm = {
      ...user,
      password: await bcrypt.hash(user.password, salt),
      roleType,
    };

    const res = await this._userRepository.insert(userConfirm);
    return { rowId: res.identifiers[0].id };
  }

  async update(userId: string, userData: UpdateUserDto) {
    const userExist = await this.findOne(userId);
    if (userData.email) {
      const emailExist = await this._userRepository.findOne({
        where: { userId: Not(userId), email: userData.email },
      });

      if (emailExist) {
        throw new HttpException(
          'Ya existe un usuario con este correo',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (userData.identificationNumber) {
      const identificationNumberExist = await this._userRepository.findOne({
        where: {
          userId: Not(userId),
          identificationNumber: userData.identificationNumber,
        },
      });
      if (identificationNumberExist) {
        throw new HttpException(
          'Ya existe un usuario con ese tipo y número de identificación',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (!userExist) {
      throw new HttpException('El usuario no existe', HttpStatus.NOT_FOUND);
    }

    return await this._userRepository.update(
      { userId },
      {
        ...userData,

        roleType: {
          roleTypeId: userData.roleType || userExist.roleType.roleTypeId,
        },
      },
    );
  }

  private validatePasswordMatch(password: string, confirmPassword: string) {
    if (password !== confirmPassword) {
      throw new HttpException(
        'Las contraseñas no coinciden',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(): Promise<User[]> {
    return await this._userRepository.find();
  }

  async findOne(userId: string): Promise<Omit<User, 'password'>> {
    const { password, ...user } = await this._userRepository.findOne({
      where: { userId },
      relations: ['roleType'],
    });

    if (!user) {
      throw new HttpException('El usuario no existe', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async findByParams(params: Record<string, any>): Promise<User> {
    return await this._userRepository.findOne({
      where: [params],
      relations: ['roleType'],
    });
  }

  async initData(userId: string) {
    const user = await this._userRepository.findOne({
      where: { userId: userId },
    });

    if (!user) {
      throw new HttpException('El usuario no existe', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async delete(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this._userRepository.delete(id);
  }

  async findOneByParams(
    params: UserFiltersModel,
    login: boolean = false,
    errors: boolean = true,
  ): Promise<User> {
    const user = await this._userRepository.findOne({
      where: { ...params.where },
    });
    if (!user && errors) {
      if (!login) {
        throw new HttpException(NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND);
      } else {
        throw new UnauthorizedException(INVALID_ACCESS_DATA_MESSAGE);
      }
    }
    return user;
  }

  async findByRoles(roleNames: string[]): Promise<User[]> {
    return this._userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roleType', 'roleType')
      .where('roleType.name IN (:...roleNames)', { roleNames })
      .getMany();
  }
}
