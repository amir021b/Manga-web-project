const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

// هر درخواستی به /signup اومد بفرست سراغ تابع signup در کنترلر
router.post("/signup", authController.signup);

// هر درخواستی به /login اومد بفرست سراغ تابع login در کنترلر
router.post("/login", authController.login);

module.exports = router;
