import { RoleTypeRepository } from './../repositories/roleType.repository';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class RepositoryService {
  public repositories: {
    roleType: RoleTypeRepository;
  };

  constructor(private readonly _roleRepository: RoleTypeRepository) {
    this.repositories = {
      roleType: _roleRepository,
    };
  }

  /**
   * Método para obtener todas las entidades del repositorio enviado por los parametros
   * @param repository
   * @returns
   */
  async getEntities<T>(repository: Repository<T>): Promise<T[]> {
    return await repository.find();
  }
}
