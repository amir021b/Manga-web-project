exports.getMe = async (req, res) => {
  try {
    res.status(200).json({
      status: "success",
      data: {
        user: req.user,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "failed to get user profile",
      error: err.message,
    });
  }
};
