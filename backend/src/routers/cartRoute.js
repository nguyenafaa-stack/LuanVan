import express from "express";
import {
  postToCart,
  getCart,
  deleteCartItem,
} from "../controllers/cartController.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", verifyToken, getCart);
router.post("/", verifyToken, postToCart);
router.delete("/:id", verifyToken, deleteCartItem);

export default router;
