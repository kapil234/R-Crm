const Lead = require("../models/leadModel");

const allLead = async (req, res) => {
  try {
   

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    let leads;

    if (req.user.role === "Admin") {
      leads = await Lead.find().sort({ createdAt: -1 })
        .populate("assignedTo", "name email");

    } else if (req.user.role === "Agent") {
      leads = await Lead.find({
        assignedTo: req.user._id   // ✅ FIX HERE
      }).sort({ createdAt: -1 }).populate("assignedTo", "name email");

    } else {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    res.json({
      success: true,
      data: leads
    });

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

module.exports = allLead;