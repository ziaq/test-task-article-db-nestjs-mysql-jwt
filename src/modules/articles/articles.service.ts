import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateArticleRequestDto } from './dto/create-article-request.dto';
import { GetArticlesRequestQueryDto } from './dto/get-articles-request-query.dto';
import { UpdateArticleRequestDto } from './dto/update-article-request.dto';
import { Article } from './entities/article.entity';
import { ArticleUpdateLog } from './entities/article-update-log.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articleRepo: Repository<Article>,

    @InjectRepository(ArticleUpdateLog)
    private updateLogRepo: Repository<ArticleUpdateLog>,
  ) {}

  async findById(id: number, userId?: number): Promise<Article> {
    const article = await this.articleRepo.findOne({ where: { id } });

    if (!article) throw new NotFoundException('Article not found');

    if (!userId && !article.isPublic) {
      throw new ForbiddenException('Access denied to private article');
    }

    return article;
  }

  async findAll(
    query: GetArticlesRequestQueryDto,
    userId?: number,
  ): Promise<Article[]> {
    const { sort, offset, limit } = query;

    const whereCondition = userId ? {} : { isPublic: true };

    return this.articleRepo.find({
      where: whereCondition,
      order: { createdAt: sort },
      skip: offset,
      take: limit,
    });
  }

  async create(userId: number, dto: CreateArticleRequestDto): Promise<Article> {
    const article = this.articleRepo.create({
      title: dto.title,
      content: dto.content,
      tags: dto.tags,
      isPublic: dto.isPublic,
      user: { id: userId },
    });

    return this.articleRepo.save(article);
  }

  async update(
    userId: number,
    id: number,
    dto: UpdateArticleRequestDto,
  ): Promise<Article> {
    const article = await this.articleRepo.findOne({ where: { id } });
    if (!article) throw new NotFoundException('Article not found');

    if (dto.title !== undefined) article.title = dto.title;
    if (dto.content !== undefined) article.content = dto.content;
    if (dto.tags !== undefined) article.tags = dto.tags ?? [];
    if (dto.isPublic !== undefined) article.isPublic = dto.isPublic;

    const updatedArticle = await this.articleRepo.save(article);

    await this.updateLogRepo.save({
      article: { id },
      updatedBy: { id: userId },
    });

    return updatedArticle;
  }

  async delete(id: number): Promise<void> {
    const article = await this.articleRepo.findOne({ where: { id } });
    if (!article) throw new NotFoundException('Article not found');

    await this.articleRepo.remove(article);
  }
}
