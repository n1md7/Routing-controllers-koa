import * as fs from "fs";
import { Sequelize } from "sequelize-typescript";
import { EnvType } from "../config/helpers";
import Config from "../config";

export default (env: EnvType, path: string): Sequelize => {
  const path2model = path + "/app/models";
  if (!fs.existsSync(path2model)) {
    throw new Error(`[${path2model}] is not valid path!`);
  }
  const sequelize = env.is.Test()
    ? new Sequelize("sqlite::memory:")
    : new Sequelize({ ...Config[(process.env.NODE_ENV as string) || "development"] });

  sequelize.addModels([path2model]);

  return sequelize;
};
