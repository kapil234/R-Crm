const Lead = require("../models/leadModel");
const Activity = require("../models/Activitymodel");

async function addLead(req, res) {
  try {
    const { name, phone, email, budget, preferredLocation, propertyType, source } = req.body;

    // ✅ Basic validation
    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name and phone are required"
      });
    }

    // ✅ Get logged-in user (agent)
    const userId = req.user?._id;

    // ✅ Create lead
    const lead = await Lead.create({
      name,
      phone,
      email,
      budget,
      preferredLocation,
      propertyType,
      source: source || "manual",
      status: "New",
      assignedTo: userId // 🔥 IMPORTANT
    });

    // ✅ Activity logs (non-blocking safe)
    try {
      await Activity.create([
        {
          action: "CREATED",
          entityType: "lead",
          entityId: lead._id,
          message: `Lead created: ${lead.name}`,
          userId: userId || null,
          userName: req.user?.name || "Unknown"
        },
        {
          action: "FOLLOWUP",
          entityType: "followup",
          entityId: lead._id,
          message: `📞 Contact ${lead.name}`,
          userId: userId || null,
          userName: req.user?.name || "Unknown",
          meta: {
            nextAction: new Date(Date.now() + 24 * 60 * 60 * 1000),
            type: "call",
            auto: true
          }
        }
      ]);
    } catch (activityError) {
      console.error("Activity log failed:", activityError.message);
    }

    return res.status(201).json({
      success: true,
      data: lead
    });

  } catch (err) {
    console.error("Add Lead Error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to create lead",
      error: err.message
    });
  }
}

module.exports = addLead;