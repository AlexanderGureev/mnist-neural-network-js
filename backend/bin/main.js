const Koa = require("koa");
const http = require("http");
const app = new Koa();
const colors = require("colors");
const middleware = require("../middleware");

const { PORT, env } = require("../config");
env !== "production" && require("../services/webpack")(app, env);

const server = http.createServer(app.callback());
app.use(middleware(app));

server.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`.black.bgWhite);
});
