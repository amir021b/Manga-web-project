const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

/**
 * Protect middleware: Restricts route access to authenticated users
 * Validates JWT bearer token and attaches user document to request object
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 */

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "you are not logged in! Please log in to get access.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id).select("-password");
    if (!currentUser) {
      return res.status(401).json({
        status: "error",
        message: "the user belonging to this token no longer exists.",
      });
    }

    req.user = currentUser;

    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        status: "error",
        message: "invalid token. please log in again.",
      });
    }
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "error",
        message: "the token has expired. please log in again.",
      });
    }
    res.status(500).json({
      status: "error",
      message: "Authentication error occurred.",
    });
  }
};
