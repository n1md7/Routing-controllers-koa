import * as cors from "@koa/cors";
import * as Router from "@koa/router";
import chalk from "chalk";
import { defaultMetadataStorage } from "class-transformer/storage";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";
import * as fs from "fs";
import { Server as HttpServer } from "http";
import * as YAML from "json-to-pretty-yaml";
import Koa from "koa";
import * as bodyParser from "koa-bodyparser";
import * as serve from "koa-static";
import { koaSwagger } from "koa2-swagger-ui";
import "reflect-metadata";
import { createKoaServer, getMetadataArgsStorage } from "routing-controllers";
import { routingControllersToSpec } from "routing-controllers-openapi";
import serveHtml from "../app/middlewares/serveHtml";
import env from "../config/helpers";
import config, { Config, Files } from "../config/server";
import log from "../logger";
import ErrorHandler from "../app/middlewares/ErrorHandler";

export default class Server {
  koa: Koa;
  config: Config;
  files: Files;

  constructor(configOptions: Config) {
    this.config = configOptions;
  }

  private static loadFiles(rootPath: string): Files {
    // Read static files
    const path2dir = rootPath + config.server.path.static;
    const reactDir = rootPath + config.server.path.dist;
    const files: Files = {
      notFound: fs.readFileSync(path2dir + "/404.html", "utf8"),
      serverError: fs.readFileSync(path2dir + "/500.html", "utf8"),
      info: fs.readFileSync(path2dir + "/info.html", "utf8"),
    };
    // When prod make sure index.html from static folder will be loaded
    if (env.is.Prod()) {
      files.index = fs.readFileSync(reactDir + "/index.html", "utf8");
    }
    return files;
  }

  startServer(): HttpServer {
    const { port, host } = this.config.server;
    this.files = Server.loadFiles(this.config.rootPath);
    this.init();
    // @ts-ignore
    return this.koa.listen(port, host, () => {
      if (!env.is.FactorySeeder()) {
        if (env.is.Dev()) {
          log.info(`Health-check - ${chalk.blueBright.bgBlack.underline(`http://localhost:${port}/health-check`)}`);
          log.info(`OpenAPI Swagger UI - ${chalk.blueBright.bgBlack.underline(`http://localhost:${port}/docs`)}`);
          log.info(`Mode: ${chalk.green.bgBlack.bold(`${env.mode}`)}`);
          log.info("Server (re)started!");
        }
      }
    });
  }

  private init(): void {
    const routingControllerOptions = {
      controllers: [this.config.rootPath + this.config.server.controller.path],
      routePrefix: this.config.server.router.prefix,
      middlewares: [ErrorHandler],
      defaults: {
        nullResultCode: 404,
        undefinedResultCode: 204,
        paramOptions: {
          required: true, // All parameters (@BodyParam, @Param etc in Actions) are required by default
        },
      },
      defaultErrorHandler: false,
    };
    this.koa = createKoaServer(routingControllerOptions);
    this.koa.use(serveHtml(this.files));
    if (env.is.Dev()) {
      // OpenAPI endpoint enabled only for Development mode
      // Parse class-validator classes into JSON Schema:
      const schemas = validationMetadatasToSchemas({
        classTransformerMetadataStorage: defaultMetadataStorage,
        refPointerPrefix: "#/components/schemas/",
      });
      // Parse routing-controllers classes into OpenAPI spec:
      const storage = getMetadataArgsStorage();
      const spec = routingControllersToSpec(storage, routingControllerOptions, {
        components: {
          schemas,
          securitySchemes: {
            basicAuth: {
              scheme: "basic",
              type: "http",
            },
          },
        },
        info: this.config.swagger.info,
      });
      fs.writeFileSync(this.config.rootPath + this.config.swagger.filePath, YAML.stringify(spec));
      this.koa.use(new Router().get("/docs", koaSwagger({ swaggerOptions: { spec } })).routes());
    }
    this.koa.use(cors({ origin: this.config.server.origin, credentials: true }));
    this.koa.use(bodyParser());
    this.koa.use(serve(this.config.rootPath + this.config.server.path.dist));
    this.koa.on("error", (type: string, message: string, error: string) => {
      log.error(`[${type}]: ${JSON.stringify(message, null, 2)}. ${JSON.stringify(error) ?? ""}`);
    });
  }
}
