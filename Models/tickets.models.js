const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    category: {
      type: String,
      default: "None",
    },
    priority: {
      type: String,
      default: "Normal",
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    status: {
      type: String,
      enum:["Open","In Progress","Resolved"],
      default: "Open",
    },
    approval:{
      type: Boolean,
      enum:["Approved","Denied"]
    }
  },
  { timestamps: true },
);

const Ticket = new mongoose.model("ticket", ticketSchema);

module.exports = Ticket;
