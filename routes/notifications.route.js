// routes/notification.routes.js
const express = require("express");
const router = express.Router();
const { notificationResponse , getActionCenter } = require("../Controller/notificationController");
const wrapAsync = require("../utils/wrapAsync");

router.get("/actionCenter", wrapAsync( getActionCenter ));
router.post("/approve/:id", wrapAsync(notificationResponse));

module.exports = router;