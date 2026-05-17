const Ticket = require("../models/Ticket");

const getTicketsLast7Days = async (req, res) => {
  try {
    const today = new Date();
    const last7Days = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      d.setHours(0, 0, 0, 0);
      last7Days.push(d);
    }

    const tickets = await Ticket.aggregate([
      {
        $match: {
          createdAt: { $gte: last7Days[0] },
          createdBy: req.user._id,   
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    const map = {};
    tickets.forEach((t) => {
      map[t._id] = t.count;
    });

    const labels = [];
    const data = [];

    last7Days.forEach((date) => {
      const key = date.toISOString().split("T")[0];
      labels.push(date.toLocaleDateString("en-US", { weekday: "short" }));
      data.push(map[key] || 0);
    });

    res.json({ labels, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = { getTicketsLast7Days };