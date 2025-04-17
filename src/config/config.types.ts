export type Config = {
  nodeEnv: 'development' | 'production';
  serverHost: string;
  serverPort: number;
  openApiUrl: string;
  clientUrl: string;
  db: {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    autoLoadEntities: true;
    synchronize: boolean;
  };
  jwtAccessSecret: string;
  jwtRefreshSecret: string;
};
