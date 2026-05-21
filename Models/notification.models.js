const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ["Pending", "Approved", "Denied", "Expired"],
        default: "Pending",
    },
    title: String,
    request: String,
    ticketId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ticket",
    },
}, { timestamps: true });

const notificationModel = new mongoose.model("notification", notificationSchema);

module.exports = notificationModel;