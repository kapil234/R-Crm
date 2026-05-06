const Client = require("../models/clientModel");
const Activity = require("../models/Activitymodel");
const mongoose = require("mongoose");

const addInteraction = async (req, res) => {
  try {
    const { clientId, type, note, date } = req.body;

    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }

    const updatedClient = await Client.findByIdAndUpdate(
      clientId,
      {
        $push: {
          interactions: {
            type,
            note,
            date: date || new Date()
          }
        }
      },
      { new: true }
    );

    await Activity.create({
      action: "UPDATED",
      entityType: "client",
      entityId: clientId,
      message: `${type} done with ${client.name}`,
      userId: req.userId,
      userName: req.user?.name
    });

    res.json({
      success: true,
      message: "Interaction added",
      data: updatedClient
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = addInteraction;