
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,

    email: {
      type: String,
      unique: true,
      required: true
    },

    phone: {
      type: String,
      default: null
    },

    password: {
      type: String,
      default: null // ✅ important for Google users
    },

    // 🔐 Google Auth Fields
    googleId: {
      type: String,
      default: null
    },

    profilePic: {
      type: String,
      default: null
    },

    role: {
      type: String,
      enum: ["Admin", "Agent", "General"],
      default: "General"
    },

    Location: String,

    designation: String,
    experience: Number,

    totalDeals: {
      type: Number,
      default: 0
    },

    totalRevenue: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);