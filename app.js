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
const ticketController = require("./Controller/ticketController");

const wrapAsync = require("./utils/wrapAsync");
const expressError = require("./utils/expressError");
const middlewares = require("./utils/middlewares");

const Ticket = require("./Models/tickets.models");
const User = require("./Models/user");
const jwt = require("jsonwebtoken");

const updateStatus = require("./cron/ticketcron");
const notificationModel = require("./Models/notification.models");
const notificationRouter = require("./routes/notifications.route");
const pageRouter = require("./routes/page.route");

// App config
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(methodOverride("_method"));

// User identification
app.use(middlewares.userIdentification);
// Locals middleware (before routes)
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});



// Routes
app.use("/helpdesk/auth", authRouter);
app.use("/api/graph", graphRouter);
app.use("/api/tickets", ticketRoutes);
app.use("/helpdesk", notificationRouter);




app.post("/api/chat", async (req, res) => {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CHAT_BOT_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Chat API failed" });
  }
});

// Page routes
app.get("/home", pageRouter.toHome);
app.get("/login",pageRouter.toLogin);
app.get("/signin", pageRouter.toSignIn);
app.get("/helpdesk/actionCenter", pageRouter.toActionCenter);
app.get("/helpdesk/dashboard", ticketController.getTickets);
app.get("/helpdesk/newTicket", ticketController.getNewTicket);
app.post("/helpdesk/dashboard", ticketController.createTicket); 
app.get("/helpdesk/ticket/:id", ticketController.editTicket);
app.get("/helpdesk/newTicket", ); 

app.get("/tickets", pageRouter.toTickets);

app.get("/performance", pageRouter.toPerformance);

app.all("*splat", (req,res,next) =>{
  next ( new expressError(`Page Not Found`, 404));
});

app.use("*splat", (err,req,res,next) =>{
  err.statusCode = err.statusCode || 402;
  err.message = err.message || " Something Went Wrong";
  res.status(err.statusCode).render("error",{err});
})

// DB & cron
connectToDB();


// Start server
app.listen(8080, () => console.log("Server running on port 8080"));