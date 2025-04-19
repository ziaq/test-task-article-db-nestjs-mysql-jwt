## Тестовое задание️ REST API — NestJS + MySQL + JWT
![Readme preview](./readme-preview-pic.png)

**Тестовое задание**  
REST API базы со статьями. Получение публичных статей любым пользователем, приватных только авторизованными. Написан на NestJS с использованием MySQL и TypeORM.

Включает в себя:  

- REST API для Аутентификации, Статей, Профиля
- Быстрый запуск проекта через Docker Compose
- Миграции для создания таблиц в БД
- OpenAPI-документация
- Валидация данных через Zod
- Аутентификация по JWT (access + refresh)
- Fingerprint-защита refresh-токенов
- Хранение данных в БД MySQL

Использовалось: NestJS, MySQL, TypeORM, JWT, Zod, nestjs-zod, swagger-ui-express, Docker, Docker Compose

## Документация REST API

Swagger UI с документацией доступнен на `http://localhost:3002/api` после запуска  
(настраивается в `.env`)

## Запуск проекта

#### 1. Клонировать репозиторий и перейти в директорию проекта

```bash
git clone https://github.com/ziaq/test-task-article-db-nestjs-mysql-jwt
```
```bash
cd test-task-article-db-nestjs-mysql-jwt
```

#### 2. Создать `.env` файл в корне проекта, скопировать туда:

```env
NODE_ENV=development

SERVER_HOST=0.0.0.0
SERVER_PORT=3002
OPENAPI_URL=http://localhost:3002
CLIENT_URL=http://localhost:5171

DB_HOST=mysql
DB_PORT=3306
DB_USERNAME=app_user
DB_PASSWORD=123456
DB_NAME=article_db

JWT_ACCESS_SECRET=secret_access_token_key_123!@#
JWT_REFRESH_SECRET=even_more_secret_refresh_token_key_456!@#
```

#### 3. Запустить проект через Docker-compose

##### 3.1 Первый запуск (сборка, применение миграций, запуск)

```bash
docker compose build && docker compose up -d mysql && docker compose run --rm app bash -c "/wait && npm run migration:run" && docker compose up
```

##### 3.2 Повторный запуск (без сборки и миграций)

```bash
docker compose up
```

##### 3.3 Остановка проекта

```bash
docker compose down
```

Примечание: миграции нужно применить один раз при первом запуске

---

Это поднимет:

- Сервер с REST API на [`http://localhost:3002`](http://localhost:3002)
- Документацию Swagger UI на [`http://localhost:3002/api`](http://localhost:3002/api)
- Базу данных MySQL

Логин, пароль, имя базы, а также другие настройки берутся из файла `.env`