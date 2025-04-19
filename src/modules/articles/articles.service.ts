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
import { mapToArticleResponseDto } from './utils/map-to-article-response.dto';
import { ArticleResponseDto } from './dto/article-response.dto';
import { Tag } from './entities/tag.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articleRepo: Repository<Article>,

    @InjectRepository(Tag)
    private tagRepo: Repository<Tag>,

    @InjectRepository(ArticleUpdateLog)
    private updateLogRepo: Repository<ArticleUpdateLog>,
  ) {}

  async findById(id: number, userId?: number): Promise<ArticleResponseDto> {
    const article = await this.articleRepo.findOne({
      where: { id },
      relations: ['tags', 'createdByUser'],
    });
  
    if (!article) throw new NotFoundException('Article not found');
  
    if (!userId && !article.isPublic) {
      throw new ForbiddenException('Access denied to private article');
    }
  
    return mapToArticleResponseDto(article);
  }

  async findAll(
    query: GetArticlesRequestQueryDto,
    userId?: number,
  ): Promise<ArticleResponseDto[]> {
    const { sort, offset, limit, tag } = query;
  
    const qb = this.articleRepo
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.createdByUser', 'user')
      .leftJoinAndSelect('article.tags', 'tag')
      .orderBy('article.createdAt', sort)
      .skip(offset)
      .take(limit);
  
    if (!userId) {
      qb.where('article.isPublic = true');
    }
  
    if (tag) {
      qb.andWhere('tag.name = :tag', { tag });
    }
  
    const articles = await qb.getMany();
      
    return articles.map(mapToArticleResponseDto);
  }

  async create(
    userId: number, 
    dto: CreateArticleRequestDto
  ): Promise<ArticleResponseDto> {
    const tags: Tag[] = [];
  
    for (const tagName of dto.tags) {
      let tag = await this.tagRepo.findOne({ where: { name: tagName } });
  
      if (!tag) {
        tag = this.tagRepo.create({ name: tagName });
        await this.tagRepo.save(tag);
      }
  
      tags.push(tag);
    }
  
    const article = this.articleRepo.create({
      title: dto.title,
      content: dto.content,
      tags,
      isPublic: dto.isPublic,
      createdByUser: { id: userId },
    });
  
    const savedArticle = await this.articleRepo.save(article);

    const articleWithRelations = await this.articleRepo.findOneOrFail({
      where: { id: savedArticle.id },
      relations: ['tags', 'createdByUser'],
    });
  
    return mapToArticleResponseDto(articleWithRelations);
  }

  async update(
    userId: number,
    id: number,
    dto: UpdateArticleRequestDto,
  ): Promise<ArticleResponseDto> {
    const article = await this.articleRepo.findOne({
      where: { id },
      relations: ['tags'],
    });
  
    if (!article) throw new NotFoundException('Article not found');
  
    if (dto.title !== undefined) article.title = dto.title;
    if (dto.content !== undefined) article.content = dto.content;
    if (dto.isPublic !== undefined) article.isPublic = dto.isPublic;

    if (dto.tags !== undefined) {
      const tags: Tag[] = [];
  
      for (const tagName of dto.tags) {
        let tag = await this.tagRepo.findOne({ where: { name: tagName } });
  
        if (!tag) {
          tag = this.tagRepo.create({ name: tagName });
          await this.tagRepo.save(tag);
        }
  
        tags.push(tag);
      }
  
      article.tags = tags;
    }
  
    const savedArticle = await this.articleRepo.save(article);
  
    await this.updateLogRepo.save({
      article: { id },
      updatedBy: { id: userId },
    });
  
    const articleWithRelations = await this.articleRepo.findOneOrFail({
      where: { id: savedArticle.id },
      relations: ['tags', 'createdByUser'],
    });
  
    return mapToArticleResponseDto(articleWithRelations);
  }
  

  async delete(id: number): Promise<void> {
    const article = await this.articleRepo.findOne({ where: { id } });
    if (!article) throw new NotFoundException('Article not found');

    await this.articleRepo.remove(article);
  }
}
