const Property=require("../models/propertyModel")
async function deleteProperty(req, res){
  try {
    const { id } = req.params;

    await Property.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Property deleted successfully"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Delete failed"
    });
  }
};
module.exports=deleteProperty