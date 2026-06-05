const Ticket = require("../Models/tickets.models");
const cron = require("node-cron");

exports.updateStatus = async function (ticketId) {
    const job = cron.schedule("*/5 * * * *", async () => {
        
            console.log("Cron is running for ticket:", ticketId);

            const ticket = await Ticket.findById(ticketId);

            if (!ticket) {
                console.log("Ticket not found — stopping job");
                job.stop();
                return;
            }

            if (ticket.status === "Resolved" || ticket.status === "Closed") {
                console.log("Ticket already resolved/closed — stopping job");
                job.stop();
                return;
            }

            if (ticket.approval === "Approved" && ticket.status === "Open") {
                ticket.status = "In Progress";
                await ticket.save();
                console.log("Ticket moved to In Progress");

            } else if (ticket.status === "In Progress") {
                ticket.status = "Resolved";
                await ticket.save();
                console.log("Ticket moved to Resolved — stopping job");
                job.stop();
            }
    });

    return job;
};