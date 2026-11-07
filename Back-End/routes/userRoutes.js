const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * Protected User Routes
 * Requires a valid Bearer JWT token in the Authorization header
 */

router.get("/profile", authMiddleware.protect, userController.getMe);

module.exports = router;
