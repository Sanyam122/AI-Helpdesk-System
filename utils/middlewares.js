const jwt = require("jsonwebtoken");
const User = require("../Models/user");
const config = require("../config/config");

async function userIdentification(req, res, next) {
  const token =
    req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token not found" });
  }

  const decodedData = jwt.verify(token, config.JWT_SECRET);

  const user = await User.findById(decodedData.id);

  req.user = user;

  next();
}

const middlewares = { userIdentification };

module.exports = middlewares;
