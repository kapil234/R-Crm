const clientsModel = require("../models/clientModel");

async function allClients(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    let clients;

    const role = req.user.role;

    // =========================
    // 👑 ADMIN
    // =========================
    if (role === "Admin") {
      clients = await clientsModel.find().sort({ createdAt: -1 })
        .populate("agentId", "name email");

    // =========================
    // 👨‍💼 AGENT
    // =========================
    } else if (role === "Agent") {
      clients = await clientsModel.find({
        agentId: req.user._id
      }) .sort({ createdAt: -1 }).populate("agentId", "name email");

    // =========================
    // ❌ NO ACCESS
    // =========================
    } else {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    // =========================
    // ✅ SEND RESPONSE (IMPORTANT)
    // =========================
    return res.status(200).json({
      success: true,
      data: clients
    });

  } catch (err) {
    return res.status(500).json({
      message: err.message || err,
      error: true,
      success: false
    });
  }
}

module.exports = allClients;