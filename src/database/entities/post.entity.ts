import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseCustomEntity } from './base.custom.entity';
import { UserEntity } from './user.entity';
import { TableNameEnum } from './enums/table.name.enum';
import { PostCategory } from './enums/post.category.enum';

@Entity({ name: TableNameEnum.POSTS })
export class PostEntity extends BaseCustomEntity {
  @Column('text')
  title: string;

  @Column('text')
  content: string;

  @Column({
    type: 'enum',
    enum: PostCategory,
    default: PostCategory.TECHNOLOGY,
  })
  category: PostCategory;

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
