import express from "express";
import productRoute from "./productRoute.js";
import cartRoute from "./cartRoute.js";
import authRoute from "./authRoute.js";
import categoryRoute from "./categoryRoute.js";

const router = express.Router();

router.use("/products", productRoute);
router.use("/cart", cartRoute);
router.use("/auth", authRoute);
router.use("/category", categoryRoute);

export default router;
