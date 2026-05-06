// GET /api/deal/:id
const Deal = require("../models/dealModel");

async function getDeal(req, res){
  try {
    const { id } = req.params;

    const deal = await Deal.findById(id)
      .populate("clientId", "name email phone")
      .populate("propertyId", "title location")
      .populate("agentId", "name email phone");

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: "Deal not found"
      });
    }

    res.json({
      success: true,
      data: deal
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

module.exports = getDeal;