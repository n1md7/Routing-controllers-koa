import env from "./config/helpers";
import config from "./config/server";
import Server from "./server";
import database from "./database/connection";

(async (rootPath: string) => {
  try {
    await database(env, rootPath).authenticate();
    config.rootPath = rootPath;
    new Server(config).startServer();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})(__dirname);
