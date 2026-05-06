const Client = require("../models/clientModel");

async function addClient(req, res) {
  try {
    const userId = req.user._id; // ✅ logged-in agent

    const client = new Client({
      ...req.body,
      agentId: userId // ✅ auto assign agent
    });

    await client.save();

    res.json({
      success: true,
      data: client
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
}

module.exports = addClient ;