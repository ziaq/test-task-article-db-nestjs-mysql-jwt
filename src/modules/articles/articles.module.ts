import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { Article } from './entities/article.entity';
import { ArticleUpdateLog } from './entities/article-update-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Article, ArticleUpdateLog])],
  providers: [ArticlesService],
  controllers: [ArticlesController],
})
export class ArticlesModule {}
