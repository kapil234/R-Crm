const propertyModel=require("../models/propertyModel")

const propertyDetail = async(req,res)=>{
    try{
        const { id } = req.params

        const property = await propertyModel.findById(id)

        res.json({
            data : property,
            message : "Ok",
            success : true,
            error : false
        })

        
    }catch(err){
        res.json({
            message : err?.message  || err,
            error : true,
            success : false
        })
    }
}

module.exports = propertyDetail;