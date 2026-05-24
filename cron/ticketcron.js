const Ticket = require("../Models/tickets.models");
const cron = require("node-cron");

exports.updateStatus = async function(ticketId) {

    const job = cron.schedule("*/5 * * * *", async () => {
        try {
            console.log("Cron is running");

            const ticket = await Ticket.findById(ticketId);

            if (!ticket) {
                console.log("Ticket not found — stopping job");
                job.stop(); 
                return;
            }

            if (ticket.status === "Resolved") {
                job.stop(); 
                return;
            }

            if (ticket.approval === "approved" && ticket.status === "open") {
                ticket.status = "Pending";
                await ticket.save();

            } else if (ticket.status === "Pending") {
                ticket.status = "Resolved";
                await ticket.save();
            }

        } catch (err) {
            console.error("Cron error:", err.message);
            job.stop(); 
        }
    });

    return job;
};