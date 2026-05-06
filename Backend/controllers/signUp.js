const bcrypt = require("bcryptjs");
const User = require("../models/userSchema");

async function userSignUp(req, res) {
  try {
    const { email, password, name,  phone } = req.body;

    // check existing user
    const user = await User.findOne({ email });
    if (user) {
      throw new Error("User already exists");
    }

    // validations
    if (!email) throw new Error("Please provide email");
    if (!password) throw new Error("Please provide password");
    if (!name) throw new Error("Please provide name");
    if (! phone) throw new Error("Please provide  phone number");

    // hash password
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    if (!hashPassword) {
      throw new Error("Something went wrong");
    }

    // payload
    const payload = {
      email,
      name,
       phone,
      role: "General",
      password: hashPassword
    };

    // save user
    const userData = new User(payload);
    const saveUser = await userData.save();

    res.status(201).json({
      data: saveUser,
      success: true,
      error: false,
      message: "User created successfully!"
    });

  } catch (err) {
    res.status(400).json({
      message: err.message || err,
      error: true,
      success: false
    });
  }
}

module.exports = userSignUp;