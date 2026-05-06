const Property=require("../models/propertyModel")
  
async function allProperties(req,res){
   try {
       const { search, sort } = req.query;

    let query = {};

    // 🔍 SEARCH (name OR location)
    if (search && search.trim() !== "") {
      query = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } }
        ]
      };
    }

    // 📊 SORT
    let sortOption = {};

    if (sort === "asc") {
      sortOption = { price: 1 };
    } else if (sort === "desc") {
      sortOption = { price: -1 };
    }

    const properties = await Property.find(query).sort(sortOption);

    res.json({
      success: true,
      data: properties
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
module.exports =allProperties;