const Ticket = require("../Models/tickets.models");
const cron = require("node-cron");

const activeJobs = new Map();

exports.updateStatus = function (ticketId) {
    if (activeJobs.has(ticketId.toString())) {
        return activeJobs.get(ticketId.toString());
    }

    const job = cron.schedule("*/5 * * * *", async () => {
        
            console.log("Cron is running for ticket:", ticketId);

            const ticket = await Ticket.find({_id : ticketId});
            console.log(ticket);

            if (!ticket) {
                console.log("Ticket not found — stopping job");
                stopJob(ticketId);
                return;
            }

            if (ticket.status === "Resolved" || ticket.status === "Closed") {
                console.log("Ticket already resolved/closed — stopping job");
                stopJob(ticketId);
                return;
            }

            if (ticket.approval === "Approved" && ticket.status === "Open") {
                ticket.status = "In Progress";
                await ticket.save();
                console.log("Ticket moved to In Progress");
                return;
            }

            if (ticket.status === "In Progress") {
                ticket.status = "Resolved";
                await ticket.save();
                console.log("Ticket moved to Resolved — stopping job");
                stopJob(ticketId);
            }
    });

    activeJobs.set(ticketId.toString(), job);
    return job;
};

function stopJob(ticketId) {
    const key = ticketId.toString();
    const job = activeJobs.get(key);

    if (job) {
        job.stop();
        activeJobs.delete(key);
    }
}