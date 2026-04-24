// 🔹 Core imports (always first)
const express = require("express");
const app = express();

const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const ejsMate = require("ejs-mate");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");

const { connectToDB } = require("./config/database");
const { authRouter, graphRouter } = require("./routes/auth.routes");
const ticketRoutes = require("./routes/ticket.route");

const wrapAsync = require("./utils/wrapAsync");
const expressError = require("./utils/expressError");
const middlewares = require("./utils/middlewares");

const Ticket = require("./Models/tickets.models");
const User = require("./Models/user");
const jwt = require("jsonwebtoken");

const updateStatus = require("./cron/ticketcron");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use(cookieParser());
app.use(methodOverride("_method"));

app.use(middlewares.userIdentification);

app.use("/helpdesk/auth", authRouter);
app.use("/api/graph", graphRouter);
app.use("/api/tickets", ticketRoutes);
app.use("/" , ticketRoutes);
app.post("/api/chat", async (req, res) => {
  
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CHAT_BOT_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      },
    );

    const data = await response.json();
    res.json(data);
  } 
);

connectToDB();
updateStatus();

app.listen(8080, () => {
  console.log("Server running on port 3000");
});

// locals Middleware
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// Pages
app.get("/", (req, res) => res.send("Hi this is home page"));
app.get("/home", (req, res) => res.render("Home"));
app.get("/login", (req, res) => res.render("login"));
app.get("/signin", (req, res) => res.render("signin"));

app.get("/tickets", async (req, res) => {
  const tickets = await Ticket.find();
  res.render("Tickets", { tickets });
});

app.get("/performance", async (req, res) => {
  const tickets = await Ticket.find();
  const user = await User.findById(req.user._id);
  res.render("performance", { tickets, user });
});
