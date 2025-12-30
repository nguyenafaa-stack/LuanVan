const express = require("express");
const router = express.Router();
const {
  postToCart,
  getCart,
  deleteCartItem,
} = require("../controllers/cartController.js");
const { verifyToken } = require("../middlewares/auth");

router.post("/add", verifyToken, postToCart);
router.get("/", verifyToken, getCart);
router.delete("/:id", verifyToken, deleteCartItem);

module.exports = router;
