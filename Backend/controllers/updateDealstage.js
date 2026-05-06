const Deal = require("../models/dealModel")
const Activity=require("../models/Activitymodel")
const Lead=require("../models/leadModel")

const updateDealStage = async(req,res)=>{

  const {id} = req.params
  const {stage} = req.body

  const deal = await Deal.findByIdAndUpdate(
    id,
    {stage},
    {new:true}
  )
   if (stage === "Closed") {
     const updatedLead = await Lead.findByIdAndUpdate(
  deal.leadId,
  { status: "Closed" },
  { new: true }
);


      await Activity.create({
        action: "CLOSED",
        entityType: "deal",
        entityId: deal._id,
        message: `Deal closed ₹${deal.price}`,
        userId: req.userId,
        userName: req.user?.name || "Unknown",
        meta: { price: deal.price }
      });
    }
       if (stage === "Lost") {
      await Lead.findByIdAndUpdate(deal.leadId, {
        status: "Lost"
      });
    }

  res.json({
    success:true,
    data:deal
  })

}

module.exports = updateDealStage