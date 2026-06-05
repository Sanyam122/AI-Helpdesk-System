const jwt = require("jsonwebtoken");
const User = require("../Models/user");
const config = require("../config/config");

async function userIdentification(req, res, next) {

    const publicRoutes = [
      "/home",
      "/login",
      "/signin",
      "/helpdesk/auth/login",
      "/helpdesk/auth/register",
      "/helpdesk/auth/google",
      "/helpdesk/auth/google/callback",
    ];

    if (
      publicRoutes.includes(req.path) ||
      req.path.startsWith("/helpdesk/auth/google")
    ) {
      return next();
    }

    const token =
      req.cookies.accessToken ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.redirect("/home");
    }

    const decodedData = jwt.verify(
      token,
      config.JWT_SECRET
    );

    const user = await User.findById(decodedData.id);

    if (!user) {
      res.clearCookie("accessToken");
      return res.redirect("/home");
    }

    req.user = user;
    next();
  
}




module.exports = {
  userIdentification,
};