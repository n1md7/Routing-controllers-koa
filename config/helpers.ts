require("dotenv").config();
import { Env } from "../types/Env";

const env = ((Env, params) => {
  return new Env(params);
})(function (params): void {
  if (!params.NODE_ENV) throw new Error("Mandatory param NODE_ENV is not defined");
  const is = (env: Env): boolean => env === params.NODE_ENV;
  this.is = is;
  this.mode = params.NODE_ENV;
  this.is.Prod = () => is(Env.Prod);
  this.is.Dev = () => is(Env.Dev);
  this.is.Test = () => is(Env.Test);
  this.is.FactorySeeder = () => is(Env.FactorySeeder);
}, process.env);

export default env;
export type EnvType = typeof env;
