import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoleType } from './roleType.entity';

@Entity({ name: 'User' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column('varchar', {
    length: 50,
    nullable: false,
  })
  identificationNumber: string;

  @Column('varchar', {
    length: 255,
    nullable: false,
  })
  fullName: string;

  @Column('varchar', {
    length: 150,
    nullable: false,
  })
  email: string;

  @Column('varchar', {
    length: 255,
    nullable: false,
  })
  password: string;

  @ManyToOne(() => RoleType, (roleType) => roleType.user)
  @JoinColumn({ name: 'roleTypeId' })
  roleType: RoleType;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt?: Date;
}
