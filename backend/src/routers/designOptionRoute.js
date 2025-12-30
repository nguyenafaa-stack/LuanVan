const express = require("express");
const router = express.Router();
const {
  getOptions,
  addOption,
} = require("../controllers/designOptionController.js");

router.get("/", getOptions);

router.post("/", addOption);

module.exports = router;
