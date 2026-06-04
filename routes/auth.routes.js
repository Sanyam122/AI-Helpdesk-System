const express = require("express");
const authController = require("../Controller/author");
const authRouter = express.Router();
const graphRouter = express.Router();
const wrapAsync = require("../utils/wrapAsync");


authRouter.post("/register", wrapAsync(authController.register));
authRouter.get("/getme", wrapAsync( authController.getMe ));
authRouter.post("/login", wrapAsync(authController.login));

const { getTicketsLast7Days } = require("../Controller/ticketController");
graphRouter.get("/last-7-days", wrapAsync(getTicketsLast7Days));

module.exports = { authRouter, graphRouter };