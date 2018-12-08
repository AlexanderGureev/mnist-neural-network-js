
module.exports = router => {

  router.get("/api/token", async ctx => {
    ctx.body = { token: "" };
  });
  
};
