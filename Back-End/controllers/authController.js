const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

/**
 * Generate signed JSON Web Token
 * @param {string} id - Database ObjectId of target user
 * @returns {string} Signed JWT token valid for 7 days
 */

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

/**
 * Register a new user account
 * @route   POST /api/auth/signup
 * @access  Public
 */

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body || {};

    if (!username || !email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Please provide username, email, and password.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        status: "error",
        message: "Password must be at least 8 characters.",
      });
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({
        status: "error",
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
      status: "success",
      message: "Sign up successful",
      data: {
        token,
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
        },
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res
      .status(500)
      .json({ status: "error", message: "Internal server error!" });
  }
};

/**
 * Authenticate existing user and issue token
 * @route   POST /api/auth/login
 * @access  Public
 */

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Please provide email and password.",
      });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Email or password is INCORRECT.",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        status: "error",
        message: "Email or password is INCORRECT.",
      });
    }

    const token = signToken(user._id);

    console.log("🔓 User logged in from MongoDB:", user.email);

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res
      .status(500)
      .json({ status: "error", message: "Internal server error!" });
  }
};
