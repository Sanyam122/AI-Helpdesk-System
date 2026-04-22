const express = require("express");
const router = express.Router();
const ticketController = require("../Controller/ticketController");

router.get("/last-7-days", ticketController.getTicketsLast7Days);

module.exports = router;
