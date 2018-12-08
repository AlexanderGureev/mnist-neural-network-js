const Router = require("koa-router");
const router = new Router();
const { env } = require("../config");

require("./api")(router);

if (env !== "none") {
  router.get("*", async (ctx, next) => {
    await ctx.render("index");
  });
}

module.exports.routes = () => router.routes();
module.exports.allowedMethods = () => router.allowedMethods();
