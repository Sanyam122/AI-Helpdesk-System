const express = require("express");
const authController = require("../Controller/author");
const authRouter = express.Router();
const graphRouter = express.Router();


authRouter.post("/register", authController.register);
authRouter.get("/getme", authController.getMe);
authRouter.post("/login", authController.login);

const { getTicketsLast7Days } = require("../Controller/ticketController");
graphRouter.get("/last-7-days", getTicketsLast7Days);

module.exports = { authRouter, graphRouter };