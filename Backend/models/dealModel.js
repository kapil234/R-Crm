const mongoose = require("mongoose")

const dealSchema = new mongoose.Schema({

  clientId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required:true
  },

  propertyId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Property"
  },
  propertyTitle: String,
  propertyLocation: String,


  agentId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  stage:{
    type:String,
    enum:["Inquiry","Negotiation","Agreement","Closed"],
    default:"Inquiry"
  },

  price:{
    type:Number
  }, 
  leadId: {   // ✅ ADD THIS
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lead"
  },

  commission:{
    type:Number
  },

  documents:[
    {
      name:String,
      fileUrl:String
    }
  ]

},{timestamps:true})

module.exports = mongoose.model("Deal",dealSchema)