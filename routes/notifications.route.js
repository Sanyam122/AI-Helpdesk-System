// routes/notification.routes.js
const express = require("express");
const router = express.Router();
const { approveNotification, getActionCenter } = require("../Controllers/notification.controller");

router.get("/actionCenter/:ticketId", getActionCenter);
router.post("/approve/:id", approveNotification);

module.exports = router;