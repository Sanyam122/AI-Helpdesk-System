const jwt = require("jsonwebtoken");
const User = require("../Models/user");
const config = require("../config/config");

async function userIdentification(req, res, next) {
  const publicRoutes = [
    "/home",
    "/login", 
    "/signin",
    "/helpdesk/auth/login",    // ✅ add this
    "/helpdesk/auth/register", // ✅ add this
  ];

  if (publicRoutes.includes(req.path)) return next();

  const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

  if (!token) return res.redirect("/home");

  try {
    const decodedData = jwt.verify(token, config.JWT_SECRET);
    req.user = await User.findById(decodedData.id);
    next();
  } catch (err) {
    res.clearCookie("accessToken");
    return res.redirect("/home");
  }
}

module.exports = { userIdentification };