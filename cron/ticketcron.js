const cron = require("node-cron");
const Ticket = require("../Models/tickets.models");

const updateStatus = () =>{
    cron.schedule("*/10 * * * *", async () =>{
        console.log("cron Started");
        const twoHour = 2 * 60 * 60 * 1000;
        const fourHour = 4 * 60 * 60 * 1000;

        const now = new Date();

        const past2h = new Date(Date.now() - twoHour);
        const past4h = new Date(now.getTime() - fourHour);

        const update1 = await Ticket.updateMany(
        {
          status: "Open",
          createdAt: { $lte: past2h },
        },
        {
          $set: { status: "In Progress" },
        }
       );

       const update2 = await Ticket.updateMany({
        status:"In Progress",
        createdAt:{$lte:past4h},
       },{
        $set: {status: "Resolved"},
       });
    })
};

module.exports = updateStatus;
