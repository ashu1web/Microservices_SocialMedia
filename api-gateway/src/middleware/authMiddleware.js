const logger = require("../utils/logger");
const jwt = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    logger.warn("Access attempt without valid token! api-gatewayfolder");
    return res.status(401).json({
      message: "Authentication required api-gatewayfolder",
      success: false,
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => { //you are getting that user object from this function indirectly — specifically from the payload you include when calling jwt.sign().In identity-service utils generate token
    if (err) {
      logger.warn("Invalid token!");
      return res.status(429).json({
        message: "Invalid token!",
        success: false,
      });
    }

    req.user = user;
    next();
  });
};

module.exports = { validateToken };