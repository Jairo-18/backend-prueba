import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { AccessSessions } from '../entities/accessSessions.entity';

@Injectable()
export class AccessSessionsRepository extends Repository<AccessSessions> {
  constructor(dataSource: DataSource) {
    super(AccessSessions, dataSource.createEntityManager());
  }
}
