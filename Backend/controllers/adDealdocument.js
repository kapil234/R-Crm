const Deal = require("../models/dealModel");

async function addDealDocument(req, res){
  try {
    const { name, fileUrl } = req.body;
    const { id } = req.params;

    const deal = await Deal.findByIdAndUpdate(
      id,
      {
        $push: {
          documents: { name, fileUrl }
        }
      },
      { new: true }
    );

    res.json({
      success: true,
      data: deal
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

module.exports =addDealDocument;