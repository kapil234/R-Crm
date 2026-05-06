
// controller
const Property = require("../models/propertyModel");
 async function addProperties(req, res){
  try {
    const property = new Property(req.body);
    await property.save();

    res.json({ success: true, data: property, });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = addProperties;

