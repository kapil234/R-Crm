const Client = require("../models/clientModel");
const mongoose = require("mongoose");

async function clientDetails(req, res) {
  try {
    const { id } = req.params;

    // ✅ Check valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid client ID",
        success: false,
        error: true
      });
    }

    // ✅ Fetch client with relations
    const client = await Client.findById(id)
    //   .populate("leadId", "name phone email")
    .populate("agentId", "name email city")
    .populate("history.propertyId");

    // ❌ Not found case
    if (!client) {
      return res.status(404).json({
        message: "Client not found",
        success: false,
        error: true
      });
    }

    // ✅ Success
    res.status(200).json({
      data: client,
      message: "Client fetched successfully",
      success: true,
      error: false
    });

  } catch (err) {
    res.status(500).json({
      message: err.message || err,
      success: false,
      error: true
    });
  }
}

module.exports = clientDetails;
