import { Column, Entity, OneToMany } from 'typeorm';

import { BaseCustomEntity } from './base.custom.entity';
import { PostEntity } from './post.entity';
import { RefreshTokenEntity } from './refresh.token.entity';
import { TableNameEnum } from './enums/table.name.enum';

@Entity({ name: TableNameEnum.USERS })
export class UserEntity extends BaseCustomEntity {
  @Column('text')
  firstName: string;

  @Column('text')
  lastName: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text', { select: false })
  password: string;

  @Column('text', { nullable: true })
  avatar?: string;

  @Column('integer', { nullable: true })
  age?: number;

  @Column('text', { nullable: true })
  city?: string;

  @Column('text', { nullable: true })
  bio?: string;

  @OneToMany(() => PostEntity, (entity) => entity.user)
  posts?: PostEntity[];

  @OneToMany(() => RefreshTokenEntity, (entity) => entity.user)
  refreshTokens?: RefreshTokenEntity[];
}
