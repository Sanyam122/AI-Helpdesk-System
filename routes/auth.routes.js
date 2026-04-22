const express = require("express");
const app = express();
const authController = require("../Controller/author");
const authRouter = express.Router();
const graphRouter = express.Router();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

authRouter.post("/register", authController.register);
authRouter.get("/getme", authController.getMe);
authRouter.post("/login", authController.login);

const { getTicketsLast7Days } = require("../Controller/ticketController");

graphRouter.get("/last-7-days", getTicketsLast7Days);

module.exports = {
  authRouter,
  graphRouter,
};
