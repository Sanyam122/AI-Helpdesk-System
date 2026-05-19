const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    status:{
        type: Boolean,
        enum:["Pending","Approved","Denied"],
        default:"Pending",
    },
    title: String,
    request:String,
})

 const notificationModel = new mongoose.model("notification",notificationSchema);

module.exports = notificationModel;