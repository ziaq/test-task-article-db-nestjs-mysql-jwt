import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Article } from '../../articles/entities/article.entity';
import { User } from '../../users/entities/user.entity';

@Entity('article_update_log')
export class ArticleUpdateLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Article, { onDelete: 'CASCADE' })
  article: Article;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  updatedBy: User;

  @CreateDateColumn()
  updatedAt: Date;
}
