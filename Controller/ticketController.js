const Ticket = require("../Models/tickets.models");
const User = require("../Models/user");
const { createNotification } = require("../Controller/notificationController");
const {faker} = require("@faker-js/faker");
exports.getNewTicket = (req, res) => {
  res.render("create");
};

exports.createTicket = async (req, res) => {
  const { title, category, priority, description } = req.body;

  const ticket = await Ticket.create({
    title,
    category,
    priority,
    description,
    createdBy: req.user._id,
    status: "Open",
    assignedTo: faker.person.fullName(),
  });

  await User.findByIdAndUpdate(
    req.user._id,
    { $inc: { count: 1 } },
    { new: true },
  );
  
  await createNotification(ticket._id);
  req.session.flash = {
    type: "success",
    message: "Ticket created successfully",
  };
  res.redirect("/helpdesk/actionCenter");
};

exports.getTickets = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "User not found" });

  const tickets = await Ticket.find({ createdBy: req.user._id });

  res.render("dashboard", { tickets, user: req.user });
};

exports.editTicket = async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) return res.status(404).json({ message: "Ticket not found" });

  res.render("edit", { ticket });
};

exports.updateTicket = async (req, res) => {
  const { title, category, priority, description } = req.body;

  const updatedTicket = await Ticket.findOneAndUpdate(
    { _id: req.params.id, createdBy: req.user._id },
    { title, category, priority, description },
    { new: true, runValidators: true },
  );

  if (!updatedTicket)
    return res.status(404).json({ message: "Ticket not found" });

  res.redirect("/helpdesk/dashboard");
};

exports.destroyTicket = async (req, res) => {
  const ticket = await Ticket.findOneAndDelete({
    _id: req.params.id,
    createdBy: req.user._id,
  });

  if (!ticket) return res.status(404).json({ message: "Ticket not found" });

  await User.updateOne(
    { _id: req.user._id, count: { $gt: 0 } },
    { $inc: { count: -1 } },
  );

  res.redirect("/helpdesk/dashboard");
};

exports.getTicketsLast7Days = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "User not found" });

  const now = new Date();
  const startDate = new Date();
  startDate.setDate(now.getDate() - 6);
  startDate.setHours(0, 0, 0, 0);

  const tickets = await Ticket.find({
    createdBy: req.user._id,
    createdAt: { $gte: startDate },
  });

  const map = {};

  tickets.forEach((t) => {
    const date = new Date(t.createdAt);
    const key = date.toISOString().split("T")[0];
    map[key] = (map[key] || 0) + 1;
  });

  const labels = [];
  const data = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    d.setHours(0, 0, 0, 0);

    const key = d.toISOString().split("T")[0];

    labels.push(d.toLocaleDateString("en-US", { weekday: "short" }));
    data.push(map[key] || 0);
  }

  res.json({ labels, data });
};

exports.getTicketsAPI = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "User not found" });

  const page = parseInt(req.query.page) || 1;
  const limit = 2;
  const skip = (page - 1) * limit;

  const totalTickets = await Ticket.countDocuments({
    createdBy: req.user._id,
  });

  const tickets = await Ticket.find({ createdBy: req.user._id })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.json({
    tickets,
    currentPage: page,
    totalPages: Math.ceil(totalTickets / limit),
  });
};