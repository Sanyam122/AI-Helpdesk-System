const { updateStatus } = require("../cron/ticketcron");
const Ticket = require("../Models/tickets.models");

toPerformance = async (req, res) => {
  const tickets = await Ticket.find({createdBy : req.user});
  const activeTickets = await Ticket.countDocuments({createdBy : req.user});
  res.render("performance",{tickets, activeTickets});
};

toTickets =  async (req, res) => {
  const tickets = await Ticket.find({createdBy: req.user});

  const openTickets = await Ticket.countDocuments({
    createdBy : req.user,
    status: "Open",
  })
  const resolvedTickets = await Ticket.countDocuments({
    createdBy: req.user,
    status : "Resolved"
  })
  const pendingTickets = await Ticket.countDocuments({
    createdBy : req.user,
    status: "In Progress"
  })
  
  return res.render("Tickets", { tickets , resolvedTickets , pendingTickets, openTickets});
};

toCreate = (req, res) => res.render("create");

toActionCenter =  async (req, res) => {
    const notifications = await notificationModel.find();
    res.render("actionCenter", { notifications });
};

toSignIn =  (req, res) => res.render("signin");
toLogin =  (req, res) => res.render("login");
toHome =  (req, res) => res.render("Home");

const pageController  = {toSignIn ,toLogin, toHome, toActionCenter, toTickets, toPerformance};
module.exports = pageController;