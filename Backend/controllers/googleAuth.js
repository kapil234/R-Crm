// controllers/googleAuth.js
const User = require("../models/userSchema");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function googleAuth(req, res) {
  try {
    const { token } = req.body;

    if (!token) throw new Error("Token missing");

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (user) {
      // 🔗 Merge account
      if (!user.googleId) {
        user.googleId = sub;
        user.profilePic = picture;
        await user.save();
      }
    } else {
      // 🆕 New user
      user = await User.create({
        email,
        name,
        googleId: sub,
        profilePic: picture,
        password: null
      });
    }

    const jwtToken = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: "8h" }
    );

    res
      .cookie("token", jwtToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
      })
      .json({
        success: true,
        message: "Google login success",
        data: jwtToken
      });

  } catch (err) {
    res.status(401).json({
      success: false,
      message: err.message
    });
  }
}

module.exports = googleAuth;