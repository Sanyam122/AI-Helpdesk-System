const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  user: {
    type: String,
    ref: "user",
    required: [true, "User is not defined"],
  },
  token: {
    type: String,
    required: [true, "Token is required"],
  },
  ip: {
    type: String,
    required: [true, "ip is not defined"],
  },
  userAgent: {
    type: String,
    required: [true, "User agent is not defined"],
  },
  revoked: {
    type: Boolean,
    default: false,
  },
});

const sessionModel = new mongoose.model("sessions", sessionSchema);

module.exports = sessionModel;
