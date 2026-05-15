const bcrypt = require("bcryptjs");
const User = require("../models/userSchema");

const jwt = require("jsonwebtoken");

async function userSignIn(req, res) {
  try {
    const { email, password } = req.body;

    if (!email) throw new Error("Please provide email");
    if (!password) throw new Error("Please provide password");

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      throw new Error("Invalid password");
    }

    const tokenData = {
      _id: user._id,
      email: user.email
      
    };

    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, {
      expiresIn: "8h"
    });


    const tokenOption = {
      httpOnly: true,
      secure: true,     
      sameSite: "None"
    };
    

    res
      .cookie("token", token, tokenOption)
      .status(200)
      .json({
        message: "Login successfully",
        data: token,
        success: true,
        error: false
      });

  } catch (err) {
    res.status(400).json({
      message: err.message || err,
      error: true,
      success: false
    });
  }
}

module.exports = userSignIn;
