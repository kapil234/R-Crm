const mongoose = require("mongoose");
const propertySchema = new mongoose.Schema({
  title: String,
  type: String,
  location: String,
  price: Number,
  size: Number,
  amenities: [String],
  images: [{
       url: String,
    public_id: String
  }],
  status: {
    type: String,
    enum: ["Available", "Sold"]
  },
  description:String,
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

module.exports = mongoose.model("Property", propertySchema);