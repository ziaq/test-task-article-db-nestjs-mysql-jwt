import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Article } from './entities/article.entity';
import { ArticleUpdateLog } from './entities/article-update-log.entity';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { Tag } from './entities/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Article, ArticleUpdateLog, Tag])],
  providers: [ArticlesService],
  controllers: [ArticlesController],
})
export class ArticlesModule {}
