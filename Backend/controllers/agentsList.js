const User = require("../models/userSchema");
const Deal = require("../models/dealModel");

async function agentList(req, res) {
  try {
    const agents = await User.find({ role: "Agent" }).select("-password");

    const stats = await Deal.aggregate([
      {
        $group: {
          _id: "$agentId",
          totalDeals: { $sum: 1 },
          closedDeals: {
            $sum: {
              $cond: [{ $eq: ["$stage", "Closed"] }, 1, 0]
            }
          },
          revenue: {
            $sum: {
              $cond: [
                { $eq: ["$stage", "Closed"] },
                "$price",
                0
              ]
            }
          }
        }
      }
    ]);

    // Convert stats array to map
    const statsMap = {};
    stats.forEach(s => {
      statsMap[s._id.toString()] = s;
    });

    // Merge stats into agents
    const result = agents.map(agent => {
      const stat = statsMap[agent._id.toString()] || {};

      return {
        ...agent.toObject(),
        totalDeals: stat.totalDeals || 0,
        closedDeals: stat.closedDeals || 0,
        totalRevenue: stat.revenue || 0
      };
    });

    res.json({
      success: true,
      data: result
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
}

module.exports = agentList;