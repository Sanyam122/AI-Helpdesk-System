const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username is required."],
  },

  email: {
    type: String,
    required: [true, "Email is required."],
    unique: true,
  },

  password: {
    type: String,
  },

  count: {
    type: Number,
    default: 0,
  },

  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },

  avatar: {
    type: String,
  },
});

module.exports = mongoose.model("users", userSchema);