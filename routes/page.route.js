const pageController = require("../Controller/pageController");
const ticketController = require("../Controller/ticketController");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");


router.get("/home", pageController.toHome);
router.get("/login",pageController.toLogin);
router.get("/signin", pageController.toSignIn);
router.get("/helpdesk/actionCenter", pageController.toActionCenter);
router.get("/helpdesk/dashboard", ticketController.getTickets);
router.get("/helpdesk/newTicket", ticketController.getNewTicket);
router.post("/helpdesk/dashboard", ticketController.createTicket); 
router.get("/helpdesk/ticket/:id", ticketController.editTicket);
router.get("/helpdesk/newTicket", ticketController.destroyTicket ); 

router.get("/tickets", pageController.toTickets);

router.get("/performance", pageController.toPerformance);

module.exports = router;