const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

async function authToken(req, res, next) {
  try {
  
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "Please login first",
        error: true,
        success: false,
      });
    }
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
  
      req.userId = decoded._id;

    const user = await User.findById(decoded._id)
    if (!user) {
      return res.status(401).json({
        message: "User not found",
        success: false,
      });
    }

    req.user = user;
   
    next();

  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token",
      error: true,
      success: false,
    });
  }
}



module.exports = authToken