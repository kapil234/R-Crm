const Deal = require("../models/dealModel");

const allDeals = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    let deals;

    const role = req.user.role;

    // =========================
    // 👑 ADMIN
    // =========================
    if (role === "Admin") {
      deals = await Deal.find()
        .populate("clientId", "name")
       .populate("propertyId")
        .populate("agentId", "name");

    // =========================
    // 👨‍💼 AGENT
    // =========================
    } else if (role === "Agent") {
      deals = await Deal.find({
        agentId: req.user._id   // ✅ FIXED
      })
        .populate("clientId", "name")
        .populate("propertyId")
        .populate("agentId", "name");

    // =========================
    // ❌ NO ACCESS
    // =========================
    } else {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    return res.status(200).json({
      success: true,
      data: deals
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

module.exports = allDeals;