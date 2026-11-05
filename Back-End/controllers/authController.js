const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        status: false,
        message: "Please provide username, email, and password.",
      });
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({
        status: false,
        message: "This email is already registered!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = signToken(newUser._id);

    console.log("✅ New user saved in MongoDB:", newUser.email);

    res.status(201).json({
      status: true,
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ status: false, message: "Internal server error!" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: "Please provide email and password.",
      });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        status: false,
        message: "Email or password is INCORRECT.",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        status: false,
        message: "Email or password is INCORRECT.",
      });
    }

    const token = signToken(user._id);

    console.log("🔓 User logged in from MongoDB:", user.email);

    res.status(200).json({
      status: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ status: false, message: "Internal server error!" });
  }
};
