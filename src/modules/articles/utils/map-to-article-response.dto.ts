import { Article } from '../entities/article.entity';
import { ArticleResponseDto } from '../dto/article-response.dto';
import { PublicUserResponseDto } from '../../users/dto/public-user-response.dto';

export function mapToArticleResponseDto(article: Article): ArticleResponseDto {
  const publicUser: PublicUserResponseDto | null = article.createdByUser
    ? {
        id: article.createdByUser.id,
        firstName: article.createdByUser.firstName,
        lastName: article.createdByUser.lastName,
      }
    : null;

  return {
    id: article.id,
    title: article.title,
    content: article.content,
    isPublic: article.isPublic,
    createdAt: article.createdAt,
    tags: article.tags.map((tag) => tag.name),
    createdByUser: publicUser,
  };
}
