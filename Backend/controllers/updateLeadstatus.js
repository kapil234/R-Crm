const Lead = require("../models/leadModel");
const Client = require("../models/clientModel");
const Deal = require("../models/dealModel");
const Activity = require("../models/Activitymodel")

const updateLeadstatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    let createdDeal = null; // Initialize this outside the blocks

    // 1. Update and get lead
    const lead = await Lead.findByIdAndUpdate(id, { status }, { new: true });

    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });}
       await Activity.create({
      action: "STATUS_CHANGE",
      entityType: "lead",
      entityId: lead._id,
      message: `Lead moved to ${status}`,
      userId: req.user._id,
      userName: req.user.name
    });
    

    // ================= QUALIFIED LOGIC =================
    if (status === "Qualified") {
      let client = await Client.findOne({ leadId: lead._id });

      // Create client if doesn't exist
      if (!client) {
        client = await Client.create({
          name: lead.name,
          phone: lead.phone,
          email: lead.email,
          budget: lead.budget,
          preferredLocation: lead.preferredLocation,
          propertyType: lead.propertyType,
          leadId: lead._id,
          agentId: lead.assignedTo,
          history: lead.propertyId ? [{ propertyId: lead.propertyId, type: "Interested" }] : []
        });
      }

      // Deal logic
      const existingDeal = await Deal.findOne({
        clientId: client._id,
        propertyId: lead.propertyId 
      });

      if (!existingDeal) {
        const newDeal = await Deal.create({
          clientId: client._id,
          agentId: lead.assignedTo,
          leadId: lead._id,
          price: lead.budget, 
          stage: "Inquiry",
          propertyId: lead.propertyId,
          propertyTitle: lead.propertyId ? null : "Direct Lead",
          propertyLocation: lead.preferredLocation
        });

        createdDeal = await Deal.findById(newDeal._id)
          .populate("clientId", "name email phone")
          .populate("propertyId", "title location")
          .populate("agentId", "name")
       //   .populate(" propertyLocation")
            await Activity.create({
          action: "CONVERTED",
          entityType: "lead",
          entityId: lead._id,
          message: `Lead converted to Client & Deal`,
          userId: req.user._id,
          userName: req.user.name
        });
      } 

      
    }

    res.json({
      success: true,
      message: "Lead updated",
      data: lead,
      deal: createdDeal 
    });

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = updateLeadstatus;