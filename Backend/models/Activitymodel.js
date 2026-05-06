const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  action: String, // CREATED, UPDATED, CLOSED
  entityType: String, // lead, deal, followup
  entityId: String,

  message: String,

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  userName: String,
 

  meta: {
    nextAction: Date,     // follow-up date
    type: String,         
  }
,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Activity", activitySchema);