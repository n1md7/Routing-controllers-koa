const config = {
  rootPath: __dirname,
  swagger: {
    filePath: "/docs/swagger.yaml",
    info: {
      description: "Generated with `routing-controllers-openapi`",
      title: "OpenAPI documentation",
      version: "1.0.0",
    },
  },
  server: {
    path: {
      static: "/app/view/static",
      dist: "/app/view/dist",
    },
    origin: process.env.ORIGIN || "localhost",
    port: process.env.PORT || 4000,
    host: process.env.HOST || "0.0.0.0",
    controller: {
      path: "/app/controllers/**/*.?s",
    },
    router: {
      prefix: process.env.API_PREFIX || "/api",
    },
  },
};

export type Config = typeof config;
export type Files = {
  index?: string;
  notFound: string;
  serverError: string;
  info: string;
};
export default config;
