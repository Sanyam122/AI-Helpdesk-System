const express = require("express");
const passport = require("passport");
const authController = require("../Controller/author");
const wrapAsync = require("../utils/wrapAsync");

const authRouter = express.Router();
const graphRouter = express.Router();

authRouter.post("/register", wrapAsync(authController.register));
authRouter.post("/login", wrapAsync(authController.login));
authRouter.get("/getme", wrapAsync(authController.getMe));

/* Google Login */
authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
   
  wrapAsync(authController.googleLogin)
);

const { getTicketsLast7Days } = require("../Controller/ticketController");

graphRouter.get(
  "/last-7-days",
  wrapAsync(getTicketsLast7Days)
);

module.exports = {
  authRouter,
  graphRouter,
};