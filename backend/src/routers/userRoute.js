const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyToken, isAdmin } = require("../middlewares/auth.js");

router.post("/add-admin", verifyToken, isAdmin, userController.addAdmin);

module.exports = router;
