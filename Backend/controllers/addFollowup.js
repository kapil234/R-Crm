const Client = require("../models/clientModel");
const Activity = require("../models/Activitymodel");
const mongoose = require("mongoose");
const addFollowUp = async (req, res) => {
  try {
    const { clientId, type, note, nextFollowUp } = req.body;

    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }

    const updatedClient = await Client.findByIdAndUpdate(
      clientId,
      {
        $push: {
          followUps: {
            type,
            note,
            nextFollowUp: new Date(nextFollowUp)
          }
        }
      },
      { new: true }
    );

    await Activity.create({
      action: "FOLLOWUP",
      entityType: "followup",
      entityId: clientId,
      message: `🔁 ${type} with ${client.name}`,
      userId: req.userId,
      userName: req.user?.name,
      meta: {
        nextAction: new Date(nextFollowUp),
        type
      }
    });

    res.json({
      success: true,
      message: "Follow-up created",
      data: updatedClient
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
module.exports=addFollowUp;