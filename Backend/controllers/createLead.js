// controllers/createLead.js
const Lead = require("../models/leadModel");
const Property = require("../models/propertyModel");
const User = require("../models/userSchema");
const mongoose = require("mongoose");
const Activity = require("../models/Activitymodel");
const transporter = require("../config/nodemailer");

// ⚠️ simple in-memory tracker
let lastAssignedIndex = {};

const createLead = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { name, phone, email, budget, preferredLocation, propertyType } = req.body;

    // validation
    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name and phone required"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID"
      });
    }

    // 1️⃣ Get property
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found"
      });
    }

    const searchLocation = preferredLocation || property.location;
    const location = searchLocation?.trim();

    const agents = await User.find({
      role: "Agent",
      Location: { $regex: location, $options: "i" }
    });

    if (!agents.length) {
      return res.status(404).json({
        success: false,
        message: "No agents available in this location"
      });
    }

    // 2️⃣ Round Robin
    if (!lastAssignedIndex[location]) {
      lastAssignedIndex[location] = 0;
    }

    const index = lastAssignedIndex[location];
    const assignedAgent = agents[index];

    lastAssignedIndex[location] =
      (index + 1) % agents.length;

    // 3️⃣ Create Lead
    const lead = await Lead.create({
      name,
      phone,
      email,
      budget,
      preferredLocation: preferredLocation || location,
      propertyType,
      source: "website",
      status: "New",
      assignedTo: assignedAgent._id,
      propertyId: propertyId
    });

    // ================= EMAIL NOTIFICATION =================
    if (assignedAgent.email) {
      try {
        await transporter.sendMail({
          to: assignedAgent.email,
          subject: "🚀 New Lead Assigned",
          html: `
            <div style="font-family:Arial;">
              <h2 style="color:#16a34a;">New Lead Assigned</h2>
              
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Phone:</strong> ${phone}</p>
              <p><strong>Email:</strong> ${email || "N/A"}</p>
              <p><strong>Location:</strong> ${preferredLocation || location}</p>
              <p><strong>Budget:</strong> ${budget || "N/A"}</p>

              <br/>
              <p>Please contact the lead as soon as possible.</p>
            </div>
          `
        });

        console.log("✅ Email sent to:", assignedAgent.email);

      } catch (mailError) {
        console.error("❌ Email failed:", mailError.message);
      }
    } else {
      console.log("⚠️ Agent has no email");
    }

    // ================= ACTIVITY =================
    try {
      await Activity.create({
        action: "CREATED",
        entityType: "lead",
        entityId: lead._id,
        message: `Lead created: ${lead.name}`,
        userId: assignedAgent._id || null,
        userName:assignedAgent.name || "Unknown"
      });

      await Activity.create({
        action: "FOLLOWUP",
        entityType: "followup",
        entityId: lead._id,
        message: `📞 Contact ${lead.name}`,
        userId:assignedAgent._id|| null,
        userName:assignedAgent.name || "Unknown",
        meta: {
          nextAction: new Date(Date.now() + 24 * 60 * 60 * 1000),
          type: "call",
          auto: true
        }
      });

    } catch (activityError) {
      console.error("Activity log failed:", activityError.message);
    }

    return res.status(201).json({
      success: true,
      message: "Lead created & assigned",
      data: lead,
      agent: assignedAgent._id
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

module.exports = createLead;