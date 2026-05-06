const userModel = require("../models/userSchema")
async function userDetailsController(req,res){
    try{
       
        const Id=req.userId
        const user=await userModel.findById(Id)
        res.status(200).json({
            data:user,
            error:false,
            success:true,
            message:"User details"
        })
       

    }catch(err){
        res.status(400).json({
            message:err.message||err,
            error:true,
            success:false
        })
    }

}
module.exports= userDetailsController;          