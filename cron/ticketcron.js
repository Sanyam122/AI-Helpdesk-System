const Ticket = require("../Models/tickets.models");
const cron = require("node-cron");

let ticketJob = null;

const updateTicketStatus = () => {

    if (ticketJob) {
        console.log("Cron already running");
        return;
    }

    ticketJob = cron.schedule("*/5 * * * *", async () => {
        try {

            console.log("Running ticket updater...");

            const tickets = await Ticket.find({
                approval: "Approved",
                status: { $nin: ["Resolved", "Closed"] }
            });

            if (tickets.length === 0) {
                console.log("No active tickets");
                return;
            }

            for (const ticket of tickets) {

                switch (ticket.status) {

                    case "Open":
                        ticket.status = "In Progress";
                        await ticket.save();
                        console.log(`${ticket._id} -> In Progress`);
                        break;

                    case "In Progress":
                        ticket.status = "Resolved";
                        await ticket.save();
                        console.log(`${ticket._id} -> Resolved`);
                        break;
                }
            }

        } catch (err) {
            console.error(err);
        }
    });

    console.log("Ticket cron started");
};

module.exports = { updateTicketStatus };