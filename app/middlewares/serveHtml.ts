import { Context, Next } from "koa";
import { Files } from "../../config/server";

export default (files: Files) => async (ctx: Context, next: Next) => {
  try {
    await next();
    const status = ctx.status || 404;
    if (status === 404) ctx.throw(404);
  } catch (error) {
    ctx.status = error.status || 500;
    if (ctx.status === 404) {
      // Check file path
      const [, ext] = ctx.path.split(".", 2);
      if (["js", "css", "png", "svg", "jpg", "jpeg"].includes(ext)) {
        ctx.body = files.notFound;
        return;
      }
      // or redirect to index html
      ctx.body = files?.index || files.info;
      return;
    }
    ctx.body = files.serverError;
  }
};
