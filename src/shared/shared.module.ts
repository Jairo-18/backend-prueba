import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { User } from './entities/user.entity';
import { RoleType } from './entities/roleType.entity';
import { UserRepository } from './repositories/user.repository';
import { RoleTypeRepository } from './repositories/roleType.repository';
import { RepositoryService } from './services/repositoriry.service';
import { AccessSessions } from './entities/accessSessions.entity';
import { AccessSessionsRepository } from './repositories/accessSessions.repository';

@Module({})
export class SharedModule {
  static forRoot(): DynamicModule {
    return {
      module: SharedModule,
      imports: [
        EventEmitterModule.forRoot(),
        TypeOrmModule.forRootAsync({
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            host: configService.get('db.host'),
            port: configService.get<number>('db.port'),
            username: configService.get('db.user'),
            password: configService.get('db.password'),
            database: configService.get('db.database'),
            entities: [__dirname + '/src/**/*.entity{.ts,.js}'],
            autoLoadEntities: true,
            ssl: {
              rejectUnauthorized: configService.get('db.ssl'),
            },
            extra: {
              max: 10,
              keepAlive: true,
            },
          }),
        }),
        PassportModule,
        TypeOrmModule.forFeature([User, RoleType, AccessSessions]),
        JwtModule.registerAsync({
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            secret: configService.get('jwt.secret'),
            signOptions: { expiresIn: configService.get('jwt.expiresIn') },
          }),
        }),
        PassportModule.register({
          defaultStrategy: 'jwt',
        }),
      ],
      controllers: [],
      providers: [
        UserRepository,
        RoleTypeRepository,
        RepositoryService,
        AccessSessionsRepository,
      ],
      exports: [
        TypeOrmModule,
        UserRepository,
        RoleTypeRepository,
        RepositoryService,
        AccessSessionsRepository,
      ],
    };
  }
}
