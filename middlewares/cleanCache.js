const { clearHash } = require("../services/cache");

module.exports = async (req, _, next) => {
  await next();
  clearHash(req.user.id);
};
