const Activity = require("../models/Activitymodel");

const getFollowsUp = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    let query = {
      action: "FOLLOWUP"
    };

    // 🔐 Agent → only their follow-ups
    if (userRole === "Agent") {
      query.userId = userId;
    }

    const data = await Activity.find(query)
      .sort({ createdAt: -1 }); // 🔥 newest first

    res.json({
      success: true,
      data
    });

  } catch (err) {
    console.error("FollowUp Error:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

module.exports = getFollowsUp;