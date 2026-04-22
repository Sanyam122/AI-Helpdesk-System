const Ticket = require("../models/Ticket");

const getTicketsLast7Days = async (req, res) => {
  try {
    const today = new Date();
    const last7Days = [];

    // Generate last 7 days (including today)
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      d.setHours(0, 0, 0, 0);
      last7Days.push(d);
    }

    const tickets = await Ticket.aggregate([
      {
        $match: {
          createdAt: {
            $gte: last7Days[0],
          },
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

    // Convert aggregation → map
    const map = {};
    tickets.forEach((t) => {
      map[t._id] = t.count;
    });

    // Build response (fill missing days with 0)
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
