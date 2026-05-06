const Activity = require("../models/Activitymodel");

async function allActivity(req, res) {
  try {
    const { userId, type, action } = req.query;

    let filter = {};

    // ✅ SAFETY CHECK
    if (!req.user || !req.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const role = req.user.role?.toLowerCase();

    // ================= ROLE LOGIC =================
    if (role === "admin") {
      // ✅ Admin → can see everything
      if (userId) {
        filter.userId = userId; // optional filter
      }
    } else {
      // 🔒 Agent → ONLY own activity
      filter.userId = req.userId;
    }

    // ================= EXTRA FILTERS =================
    if (type) filter.entityType = type;
    if (action) filter.action = action;

    // ================= FETCH =================
    const data = await Activity.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      data
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
}

module.exports = allActivity;