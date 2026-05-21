const notificationModel = require("../Models/notification.models");
const Ticket = require("../Models/tickets.models");

exports.createNotification = async function (ticketId) {
    const notifications = await notificationModel.create({
        status: "Pending",
        title: "Database Access Request",
        request: "Our technician wants access to your resources and database",
        ticketId,
    });

    console.log({notifications})
    setTimeout(async () => {
        const currentNotification = await notificationModel.findById(notification._id);

        if (currentNotification && currentNotification.status === "Pending") {
            currentNotification.status = "Expired";
            await currentNotification.save();

            await Ticket.findByIdAndUpdate(ticketId, { status: "closed" });
        }
    }, 2 * 60 * 60 * 1000);
};

exports.getActionCenter = async function (req, res) {
    try {
        const notifications = await notificationModel.find().populate("ticketId");
        console.log({notifications});
        res.render("actionCenter", { notifications });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.approveNotification = async function (req, res) {
    try {
        const notification = await notificationModel.findById(req.params.id);

        if (!notification) return res.status(404).send("Notification not found");

        notification.status = "Approved";
        await notification.save();

        return res.status(200).json({ message: "Notification approved", notification });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};