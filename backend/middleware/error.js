module.exports = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.error(err);

    const status = ctx.status || 500;
    ctx.status = 200;
   
    const { message, errors } = err;
    let validationErrors = [];

    if (errors) {
      validationErrors = Object.values(errors).map(
        ({ path, message }) => `${path}: ${message}`
      );
    }

    ctx.body = {
      status,
      errors: !validationErrors.length ? [message] : validationErrors
    };
  }
};
