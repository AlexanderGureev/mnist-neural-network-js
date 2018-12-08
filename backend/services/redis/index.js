const redisStore = require("koa-redis");
const { REDIS_URI } = require("../../config");

module.exports = {
  store: redisStore({
    url: REDIS_URI
  })
};
