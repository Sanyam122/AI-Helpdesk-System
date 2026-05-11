const express = require("express");
const router = express.Router();
const ticketController = require("../Controller/ticketController");

router.get("/last-7-days", ticketController.getTicketsLast7Days);
router.get("/dashboard", ticketController.getTicketsAPI);          

router.route("/:id/edit")
  .get(ticketController.editTicket)
  .patch(ticketController.updateTicket)
  .delete(ticketController.destroyTicket);

router.post("/", ticketController.createTicket);

module.exports = router;