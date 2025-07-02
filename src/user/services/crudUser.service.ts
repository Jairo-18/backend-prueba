import { RepositoryService } from './../../shared/services/repositoriry.service';
import { User } from './../../shared/entities/user.entity';
import { ResponsePaginationDto } from './../../shared/dtos/pagination.dto';
import { PageMetaDto } from './../../shared/dtos/pageMeta.dto';
import { UserRepository } from './../../shared/repositories/user.repository';
import { RoleType } from '../../shared/entities/roleType.entity';
import { Injectable } from '@nestjs/common';
import {
  CreateUserRelatedDataDto,
  PaginatedListUsersParamsDto,
} from '../dtos/crudUser.dto';
import { FindOptionsWhere, ILike, Raw } from 'typeorm';

@Injectable()
export class CrudUserService {
  constructor(
    private readonly _repositoriesService: RepositoryService,
    private readonly _userRepository: UserRepository,
  ) {}

  async getRelatedDataToCreate(
    isRegister: boolean,
  ): Promise<CreateUserRelatedDataDto> {
    if (!isRegister) {
      const roleType = await this._repositoriesService.getEntities<RoleType>(
        this._repositoriesService.repositories.roleType,
      );
      return { roleType };
    }

    return {};
  }

  async paginatedList(params: PaginatedListUsersParamsDto) {
    const skip = (params.page - 1) * params.perPage;

    const whereConditions: FindOptionsWhere<User> = {};

    if (params.identificationNumber) {
      whereConditions.identificationNumber = ILike(
        `%${params.identificationNumber}%`,
      );
    }

    if (params.email) {
      whereConditions.email = ILike(`%${params.email}%`);
    }

    if (params.fullName) {
      whereConditions.fullName = ILike(`%${params.fullName}%`);
    }

    if (params.roleType) {
      whereConditions.roleType = { roleTypeId: params.roleType };
    }

    if (params.dateOfBirth) {
      whereConditions.dateOfBirth = new Date(params.dateOfBirth);
    }

    if (params.createdAt) {
      whereConditions.createdAt = new Date(params.createdAt);
    }

    let finalWhereClause: FindOptionsWhere<User> | FindOptionsWhere<User>[];

    // ...
    if (params.search) {
      const globalSearchConditions: FindOptionsWhere<User>[] = [
        { ...whereConditions, fullName: ILike(`%${params.search}%`) },
        { ...whereConditions, email: ILike(`%${params.search}%`) },
        {
          ...whereConditions,
          identificationNumber: ILike(`%${params.search}%`),
        },
        { ...whereConditions, roleType: { name: ILike(`%${params.search}%`) } },
        {
          ...whereConditions,
          dateOfBirth: Raw(
            (alias) => `CAST(${alias} AS TEXT) ILIKE :searchQuery`,
            { searchQuery: `%${params.search}%` },
          ),
        },
        {
          ...whereConditions,
          createdAt: Raw(
            (alias) => `CAST(${alias} AS TEXT) ILIKE :searchQuery`,
            { searchQuery: `%${params.search}%` },
          ),
        },
      ];

      finalWhereClause = globalSearchConditions; // <--- CAMBIO AQUÍ
    } else {
      finalWhereClause = whereConditions;
    }
    // ...

    const [entities, itemCount] = await this._userRepository.findAndCount({
      where: finalWhereClause,
      skip,
      take: params.perPage,
      order: { createdAt: params.order ?? 'DESC' },
      relations: ['roleType'],
    });

    const users = entities.map((user) => {
      const newUser = {
        ...user,
        roleTypeId: user?.roleType?.roleTypeId,
        roleTypeName: user?.roleType?.name,
      };
      return newUser;
    });

    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto: params,
    });

    return new ResponsePaginationDto(users, pageMetaDto);
  }
}
