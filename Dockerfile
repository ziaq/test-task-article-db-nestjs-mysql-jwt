FROM node:23-slim

WORKDIR /app

COPY --from=ghcr.io/ufoscout/docker-compose-wait:latest /wait /wait

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

CMD /wait && npm start
