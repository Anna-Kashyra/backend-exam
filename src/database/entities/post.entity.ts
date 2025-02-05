import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseCustomEntity } from './base.custom.entity';
import { UserEntity } from './user.entity';
import { TableNameEnum } from './enums/table.name.enum';

// export enum PostCategory {
//   TECHNOLOGY = 'Technology',
//   LIFESTYLE = 'Lifestyle',
//   HEALTH = 'Health',
//   FINANCE = 'Finance',
//   ENTERTAINMENT = 'Entertainment',
// }

@Entity({ name: TableNameEnum.POSTS })
export class PostEntity extends BaseCustomEntity {
  @Column('text')
  title: string;

  @Column('text')
  content: string;

  @Column('integer', { nullable: true, default: 0 })
  likes?: number;

  @Column('integer', { nullable: true, default: 0 })
  views?: number;

  @Column('integer', { nullable: true, default: 0 })
  commentsCount?: number;

  @Column()
  userId: string;

  @ManyToOne(() => UserEntity, (entity) => entity.posts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user?: UserEntity;
}
