const notificationModel = require("../Models/notification.models");
const Ticket = require("../Models/tickets.models");
const { updateStatus } = require("../cron/ticketcron");

exports.createNotification = async function (ticketId) {
    
        const notification = await notificationModel.create({
            status: "Pending",
            title: "Database Access Request",
            request: "Our technician wants access to your resources and database",
            ticketId,
        });    

        setTimeout(async () => {
            try {
                const currentNotification = await notificationModel.findById(notification._id);

                if (currentNotification && currentNotification.status === "Pending") {
                    currentNotification.status = "Expired";
                    await currentNotification.save();

                  
                    await Ticket.findByIdAndUpdate(ticketId, { status: "Closed" });
                }
            } catch (err) {
                console.error("Auto-expire failed:", err);
            }
        }, 2 * 60 * 60 * 1000);

    };

exports.getActionCenter = async function (req, res) {

        const notifications = await notificationModel.find({ status: "Pending" });
        res.render("actionCenter", { notifications });
    
};

exports.notificationResponse = async function (req, res) {
   
        const { action } = req.body;

        if (!["Approved", "Denied"].includes(action)) {
            return res.status(400).json({ error: "Invalid Action" });
        }

        const notification = await notificationModel.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({ error: "Notification not found" });
        }

        notification.status = action;
        await notification.save();

        await Ticket.findByIdAndUpdate(notification.ticketId, {
            status: action === "Approved" ? "Open" : "Closed",
            approval: action,
        });

        await updateStatus(notification.ticketId);

        return res.redirect("/helpdesk/dashboard");
};