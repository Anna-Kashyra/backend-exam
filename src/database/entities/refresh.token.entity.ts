import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { TableNameEnum } from './enums/table.name.enum';
import { BaseCustomEntity } from './base.custom.entity';
import { UserEntity } from './user.entity';

@Entity({ name: TableNameEnum.REFRESH_TOKENS })
export class RefreshTokenEntity extends BaseCustomEntity {
  @Column('text')
  refreshToken: string;

  @Column('text')
  deviceId: string;

  @Column()
  userId: string;
  @ManyToOne(() => UserEntity, (entity) => entity.refreshTokens)
  @JoinColumn({ name: 'userId' })
  user?: UserEntity;
}
