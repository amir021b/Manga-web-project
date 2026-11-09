const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * Protected User Routes
 */

router.get("/profile", authMiddleware.protect, userController.getMe);
router.put(
  "/profile",
  authMiddleware.protect,
  userController.updateUserProfile,
);
router.put(
  "/settings",
  authMiddleware.protect,
  userController.updateUserSettings,
);

router.get("/backpack", authMiddleware.protect, userController.getBackpack);
router.post("/backpack", authMiddleware.protect, userController.toggleBackpack);

router.get("/bookmarks", authMiddleware.protect, userController.getBackpack);
router.post(
  "/bookmarks",
  authMiddleware.protect,
  userController.toggleBackpack,
);

module.exports = router;
