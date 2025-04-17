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
import { ZodSerializerDto } from 'nestjs-zod';

import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { UserId } from '../common/user-id.decorator';
import { ApiCommonErrors } from '../common/api-common-errors.decorator';

import { ArticleIdParamDto } from './dto/article-id-param.dto';
import { ArticleResponseDto } from './dto/article-response.dto';
import { CreateArticleRequestDto } from './dto/create-article-request.dto';
import { GetArticlesRequestQueryDto } from './dto/get-articles-request-query.dto';
import { GetArticlesResponseDto } from './dto/get-articles-response.dto';
import { UpdateArticleRequestDto } from './dto/update-article-request.dto';
import { ArticlesService } from './articles.service';

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
  @ApiResponse({ status: 200, type: GetArticlesResponseDto, isArray: true })
  @ApiCommonErrors(400)
  @ZodSerializerDto(GetArticlesResponseDto)
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
  @ApiResponse({ status: 200, type: ArticleResponseDto })
  @ApiCommonErrors(400, 401, 404)
  @ZodSerializerDto(ArticleResponseDto)
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
  @ApiResponse({ status: 201, type: ArticleResponseDto})
  @ApiCommonErrors(400, 401)
  @UseGuards(AccessTokenGuard)
  @ZodSerializerDto(ArticleResponseDto)
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
  @ApiResponse({ status: 200, type: ArticleResponseDto })
  @ApiCommonErrors(400, 401, 404)
  @UseGuards(AccessTokenGuard)
  @ZodSerializerDto(ArticleResponseDto)
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
  @ApiCommonErrors(400, 401, 404)
  @HttpCode(204)
  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  delete(@Param() { id }: ArticleIdParamDto): Promise<void> {
    return this.articlesService.delete(id);
  }
}
