declare namespace NodeJS {
  interface ProcessEnv {
    APP_PORT: string;
    API_PREFIX: string;
    LOGFILE: string;
    MYSQL_HOST: string;
    MYSQL_USER: string;
    MYSQL_DATABASE: string;
    MYSQL_PASSWORD: string;
    MYSQL_PORT: string;
    MYSQL_ALLOW_EMPTY_PASSWORD: string;
    MYSQL_ROOT_PASSWORD: string;
    PHPMYADMIN_PORT: string;
  }
}
