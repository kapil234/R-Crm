const Lead = require("../models/leadModel");

const deleteLead = async (req, res) => {
  try {
    const { id: leadId } = req.params;
    const { _id: userId, role: userRole } = req.user;

    let deletedLead = null;

    // 🔥 Admin → delete any lead
    if (userRole === "Admin") {
      deletedLead = await Lead.findByIdAndDelete(leadId);
    } 
    // 🔥 Agent → delete only their own leads
    else if (userRole === "Agent") {
      deletedLead = await Lead.findOneAndDelete({
        _id: leadId,
        assignedTo: userId
      });
    } 
    // ❌ Other roles → not allowed
    else {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete leads"
      });
    }

    if (!deletedLead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found or not authorized"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
      data: deletedLead._id // optional
    });

  } catch (err) {
    console.error("Delete Lead Error:", err);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

module.exports = deleteLead;