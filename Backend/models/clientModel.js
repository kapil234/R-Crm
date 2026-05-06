// models/Client.js
// models/Client.js
const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({

  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: String,

  type: {
    type: String,
    enum: ["Buyer", "Seller"],
    default: "Buyer"
  },

  budget: Number,
  preferredLocation: String,

  propertyType: {
    type: String,
    enum: ["apartment", "villa", "plot", "commercial"]
  },

  // 🔗 relations
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" },
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  status: {
    type: String,
    enum: ["Active", "Inactive", "Closed"],
    default: "Active"
  },
   interactions: [
    {
      type: {
        type: String,
        enum: ["Call", "Meeting", "Email", "Visit"]
      },
      note: String,
      date: {
        type: Date,
        default: Date.now
      },
    

    }
  ],
  followUps: [
  {
    type: {
      type: String,
      enum: ["Call", "Meeting", "Email", "Visit"]
    },
    note: String,
    nextFollowUp: Date,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }
],

  // 🏠 PROPERTY HISTORY (EMBEDDED)
  history: [
    {
      propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property"
      },
      type: {
        type: String,
        enum: ["Viewed", "Interested", "Visited"]
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ]

}, { timestamps: true });

module.exports = mongoose.model("Client", clientSchema);