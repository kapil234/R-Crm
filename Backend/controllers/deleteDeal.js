const Deal=require("../models/dealModel")
 async function dealDelete(req,res){
    try{
    const {id}=req.params;
    const deleteDeal=await Deal.findOneAndDelete({_id: id} );
    res.json({
        message:"deal deleted",
        success:true,
        data:deleteDeal,
        error:false
    })}catch(err){
         res.json({
            message : err?.message || err,
            error : true,
            success : false
        })
    }
} 
module.exports=dealDelete;