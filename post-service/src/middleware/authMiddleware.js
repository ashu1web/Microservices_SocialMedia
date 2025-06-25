const logger = require("../utils/logger");

const authenticateRequest = (req, res, next) => {
  const userId = req.headers["x-user-id"];

  if (!userId) {
    logger.warn(`Access attempted without user ID`);
    return res.status(401).json({
      success: false,
      message: "Authencation required! Please login to continue",
    });
  }

  req.user = { userId };     //we saved the userId  so that your internal service (like post-service) can easily access the user info in route handlers, middleware, DB queries, etc. — just like you would in any normal authenticated request.
  next();
};

module.exports = { authenticateRequest };