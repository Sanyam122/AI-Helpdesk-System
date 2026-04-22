const Ticket = require("../Models/tickets.models");

const getTicketsLast7Days = async (req, res) => {
  try {
    const now = new Date();
    const startDate = new Date();
    startDate.setDate(now.getDate() - 6);
    startDate.setHours(0, 0, 0, 0);

    const tickets = await Ticket.find({
      createdAt: { $gte: startDate },
    });

    // Build map
    const map = {};

    tickets.forEach((t) => {
      const date = new Date(t.createdAt);
      const key = date.toISOString().split("T")[0];

      map[key] = (map[key] || 0) + 1;
    });

    const labels = [];
    const data = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      d.setHours(0, 0, 0, 0);

      const key = d.toISOString().split("T")[0];

      labels.push(d.toLocaleDateString("en-US", { weekday: "short" }));

      data.push(map[key] || 0);
    }

    res.json({ labels, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = { getTicketsLast7Days };
