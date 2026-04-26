const express = require("express");
const router = express.Router();
const ticketController = require("../Controller/ticketController");
const Ticket = require("../Models/tickets.models");

router.get("/last-7-days", ticketController.getTicketsLast7Days);

router.get("/helpdesk/newTicket",ticketController.getNewTicket);

router.route("/helpdesk/dashboard")
.post(ticketController.createTicket)
.get(ticketController.getTickets);

router.route("/helpdesk/ticket/:id/edit")
.get(ticketController.editTicket)
.patch(ticketController.updateTicket)
.delete(ticketController.destroyTicket);

router.get("/api/dashboard", ticketController.getTicketsAPI);

module.exports = router;
