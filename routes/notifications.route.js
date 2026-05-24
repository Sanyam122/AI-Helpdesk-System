// routes/notification.routes.js
const express = require("express");
const router = express.Router();
const { notificationResponse , getActionCenter } = require("../Controller/notificationController");

router.get("/actionCenter", getActionCenter);
router.post("/approve/:id", notificationResponse);

module.exports = router;