const Deal = require("../models/dealModel");
const Lead = require("../models/leadModel");
const Activity = require("../models/Activitymodel");
 async function getAgentDetails(req, res){
  try {
    const { id } = req.params;

    const deals = await Deal.find({ agentId: id }).populate("propertyId");
    const leads = await Lead.find({ assignedTo: id });
    const activities = await Activity.find({ userId: id }).limit(20);

    const revenue = deals
      .filter(d => d.stage === "Closed")
      .reduce((sum, d) => sum + (d.price || 0), 0);

    res.json({
      success: true,
      data: {
        deals,
        leads,
        activities,
        totalDeals: deals.length,
        revenue
      }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
module.exports=getAgentDetails;