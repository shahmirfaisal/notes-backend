const { errorHandler } = require("../utils");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.get("Authorization");

  if (!token) {
    return errorHandler(next, "Unauthorized!", 401);
  }

  try {
    var tokenData = jwt.verify(token, process.env.TOKEN_SECRET);
  } catch (error) {
    return errorHandler(next, "Unauthorized!", 401);
  }

  req.userId = tokenData.userId;
  next();
};
