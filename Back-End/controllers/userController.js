const User = require("../models/userModel");

/**
 * Retrieve current authenticated user profile
 * @route   GET /api/users/profile
 * @access  Protected
 */
exports.getMe = async (req, res) => {
  try {
    res.status(200).json({
      status: "success",
      message: "User profile retrieved successfully",
      data: {
        user: req.user,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Failed to get user profile",
    });
  }
};

/**
 * Update user profile details (username, bio, avatar)
 * @route   PUT /api/users/profile
 * @access  Protected
 */
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    if (req.body.username !== undefined) user.username = req.body.username;
    if (req.body.bio !== undefined) user.bio = req.body.bio;
    if (req.body.avatar !== undefined) user.avatar = req.body.avatar;

    await user.save();

    res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          bio: user.bio,
          settings: user.settings,
          backpack: user.backpack,
        },
      },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const message = Object.values(error.errors)[0].message;
      return res.status(400).json({ status: "error", message });
    }
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to update profile",
    });
  }
};

/**
 * Update user appearance settings (theme, accentColor, density)
 * @route   PUT /api/users/settings
 * @access  Protected
 */
exports.updateUserSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const { theme, accentColor, density } = req.body;

    if (theme !== undefined) user.settings.theme = theme;
    if (accentColor !== undefined) user.settings.accentColor = accentColor;
    if (density !== undefined) user.settings.density = density;

    await user.save();

    res.status(200).json({
      status: "success",
      message: "Settings updated successfully",
      data: {
        settings: user.settings,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to update settings",
    });
  }
};

/**
 * Toggle item in backpack (Add if absent, Remove if present)
 * @route   POST /api/users/backpack
 * @access  Protected
 */
exports.toggleBackpack = async (req, res) => {
  try {
    const { mangaId } = req.body;

    if (!mangaId) {
      return res.status(400).json({
        status: "error",
        message: "mangaId is required in request body",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    if (!user.backpack) user.backpack = [];

    const idStr = String(mangaId);
    const index = user.backpack.indexOf(idStr);

    let isSaved = false;
    if (index > -1) {
      user.backpack.splice(index, 1);
    } else {
      user.backpack.push(idStr);
      isSaved = true;
    }

    await user.save();

    res.status(200).json({
      status: "success",
      message: isSaved ? "Added to backpack" : "Removed from backpack",
      data: {
        isSaved,
        backpack: user.backpack,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to toggle backpack",
    });
  }
};

/**
 * Retrieve user's backpack list
 * @route   GET /api/users/backpack
 * @access  Protected
 */
exports.getBackpack = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      status: "success",
      data: {
        backpack: user?.backpack || [],
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to get backpack",
    });
  }
};
