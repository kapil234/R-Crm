// models/Lead.js
const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({

    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    source: {
      type: String,
      enum: ["website", "ads", "call", "referral", "manual"],
      default: "manual",
    },
      status: {
    type: String,
    enum: ["New", "Contacted", "Qualified", "Closed", "Lost"],
    default: "New"
  },
    budget: Number,

    preferredLocation: String,
    propertyType: {
      type: String,
      enum: ["apartment", "villa", "plot", "commercial"],
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // agent model
    },
    propertyId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Property"
}
}, { timestamps: true });

module.exports = mongoose.model("Lead", leadSchema);