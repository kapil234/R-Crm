// UPDATE PROPERTY
const Property=require("../models/propertyModel")
const updateProperty=async(req, res)=>{
  try {
    const { id } = req.params;

    const {
      title,
      type,
      location,
      price,
      size,
      amenities,
      images,
      status,
      description
    } = req.body;

    const updated = await Property.findByIdAndUpdate(
      id,
      {
        title,
        type,
        location,
        price,
        size,
        amenities,
        images,
        status,
        description
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Property updated successfully",
      data: updated
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Update failed"
    });
  }
};
module.exports=updateProperty