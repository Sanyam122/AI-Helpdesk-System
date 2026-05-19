const Ticket = require("../Models/tickets.models");
const cron = require("node-cron");


exports.updateStatus = async function( ticketId ){

  const job = cron.schedule("*/5****" , async () =>{

    const ticket = await Ticket.findById(ticketId);

    if( !ticket){
      return "Ticket not found";
    }

    if( ticket.status === "Resolved"){
      job.stop();
    }

    if(ticket.approval === "approved" && ticket.status === "Open"){
      
      ticket.status = "Pending";
      await ticket.save();

    }else if( ticket.status ==="Pending"){

      ticket.status = "Resolved";
      await ticket.save();

    }

  })

  return job;
}