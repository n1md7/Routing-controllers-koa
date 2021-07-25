import { KoaMiddlewareInterface, Middleware } from "routing-controllers";
import { Context, Next } from "koa";
import log from "../../logger";

@Middleware({ type: "before" })
export default class ErrorHandler implements KoaMiddlewareInterface {
  async use(ctx: Context, next: Next) {
    try {
      await next();
    } catch (error) {
      const status = error.httpStatus || error.httpCode || error.status || 500;
      switch (error.name) {
        case "BadRequestError":
          ctx.body = {
            code: status,
            message: error.message,
            errors: error.errors,
          };
          break;
        case "ExposeError":
          ctx.body = {
            code: status,
            message: error.message,
            errors: error.details,
          };
          break;
        default:
          ctx.body = "Internal server error";
      }
      ctx.status = status;
      const message = JSON.stringify(error.message, null, 2) ?? "NO-MESSAGE";
      const details = JSON.stringify(error.errors, null, 2) ?? error.details ?? "NO-DETAILS";
      const stack = error.stack ?? "";
      log.error(`[ERROR ${status}]: ${message}. ${details}. ${stack}`);
    }
  }
}
