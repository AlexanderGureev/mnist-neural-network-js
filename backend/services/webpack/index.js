const config = require("../../../webpack.config.js");
const koaWebpack = require("koa-webpack");
const path = require("path");

module.exports = async (app, env) => {
  if (env !== "none") {
    return;
  }

  try {
    const middleware = await koaWebpack({
      config,
      hotClient: { allEntries: true }
    });
    app.use(middleware);

    app.use(async (ctx, next) => {
      // const [, url ] = ctx.url.split("/");
      // const pathname = url === "chat" ? "chat.html" : "index.html";

      const filename = path.resolve(config.output.path, "index.html");
      ctx.type = "html";
      ctx.body = middleware.devMiddleware.fileSystem.createReadStream(filename);
      await next();
    });

  } catch (error) {
    throw error;
  }
};
