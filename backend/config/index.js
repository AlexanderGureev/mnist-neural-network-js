const user = encodeURIComponent("chaterAdmin");
const password = encodeURIComponent("ajuNbS2909MXi");
const database = "chaterDB";
const { randomBytes } = require("crypto");

module.exports = {
  env: process.env.NODE_ENV,
  PORT: process.env.PORT || 3000,
  //MONGO_URI: process.env.MONGO_URI || `mongodb://${user}:${password}@localhost:27017/${database}`,
  REDIS_URI: process.env.REDIS_URI || `redis://localhost:6379`,
  SESSION_KEY: randomBytes(256).toString("hex")
};
