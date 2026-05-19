const notificationModel = require("../Models/notification.models");
const Ticket = require("../Models/tickets.models");

exports.createNotification = async function(ticketId){

    const notification = await notificationModel.create({
        status:Pending,
        title:"Database Access Request",
        request:"Our technician wants access to your resources and database",
    })

    setTimeout( async ()=>{
    const currentNotification = await notificationModel.findById(notification._id);

    if( currentNotification.status === "Pending"){
        currentNotification.status = "Expired";

        await currentNotification.save();

        await Ticket.findByIdAndUpdate(ticketId,{
            status:closed,
        })
    };
 },2*60*60*1000);

 console.log( notification);

  return res.render("actionCenter",{notification});
};

exports.approve_Notification = async function(tickedId){

    const notification = await notificationModel.findById(req.params.id);

    if(!notification)return res.send("Notification not found");

    notification.status = "Approved";

    await notification.save();

    return;
};
