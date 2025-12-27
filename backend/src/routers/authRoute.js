const express = require("express");
const router = express.Router();
const {
  handleRegister,
  handleLogin,
} = require("../controllers/authController.js");

router.post("/register", handleRegister);
router.post("/login", handleLogin);

module.exports = router;
