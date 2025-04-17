import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { UserId } from '../common/user-id.decorator';
import { ArticlesService } from './articles.service';
import { ArticleIdParamDto } from './dto/article-id-param.dto';
import { ArticleResponseDto } from './dto/article-response.dto';
import { CreateArticleRequestDto } from './dto/create-article-request.dto';
import { GetArticlesRequestQueryDto } from './dto/get-articles-request-query.dto';
import { GetArticlesResponseDto } from './dto/get-articles-response.dto';
import { UpdateArticleRequestDto } from './dto/update-article-request.dto';

@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Получение статей публичных / всех',
    description:
      'Возвращает публичные статьи для неавторизованных пользователей. Если передан access token, дополнительно возвращаются и приватные статьи (с isPublic: false)',
  })
  @ApiQuery({ name: 'limit', required: true, type: Number })
  @ApiQuery({ name: 'offset', required: true, type: Number })
  @ApiQuery({ name: 'sort', required: true, enum: ['ASC', 'DESC'] })
  @ApiResponse({ type: GetArticlesResponseDto, isArray: true })
  @Get()
  getAll(
    @Query() query: GetArticlesRequestQueryDto,
    @UserId() userId?: number,
  ): Promise<GetArticlesResponseDto> {
    return this.articlesService.findAll(query, userId);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Получение статьи по ID',
    description:
      'Возвращает публичную статью для неавторизованных пользователей. Если передан access token, то можно получить любую статью, в том числе с isPublic: false',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ type: ArticleResponseDto })
  @Get(':id')
  getById(
    @Param() { id }: ArticleIdParamDto,
    @UserId() userId?: number,
  ): Promise<ArticleResponseDto> {
    return this.articlesService.findById(id, userId);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Добавление новой статьи',
  })
  @ApiBody({ type: CreateArticleRequestDto })
  @ApiResponse({ type: ArticleResponseDto, status: 201 })
  @UseGuards(AccessTokenGuard)
  @Post()
  create(
    @UserId() userId: number,
    @Body() body: CreateArticleRequestDto,
  ): Promise<ArticleResponseDto> {
    return this.articlesService.create(userId, body);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Изменение статьи',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateArticleRequestDto })
  @ApiResponse({ type: ArticleResponseDto })
  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  update(
    @UserId() userId: number,
    @Param() { id }: ArticleIdParamDto,
    @Body() body: UpdateArticleRequestDto,
  ): Promise<ArticleResponseDto> {
    return this.articlesService.update(userId, id, body);
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Удаление статьи',
  })
  @ApiParam({ name: 'id', type: Number })
  @HttpCode(204)
  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  delete(@Param() { id }: ArticleIdParamDto): Promise<void> {
    return this.articlesService.delete(id);
  }
}
