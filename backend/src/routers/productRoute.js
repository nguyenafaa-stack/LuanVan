import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  addProductImages,
  getVariantDetail,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/:id", getProductById);
router.get("/", getAllProducts);
router.post("/", createProduct);
router.post("/:id/images", addProductImages);
router.post("/variants/:id/images", addProductImages);
router.get("/variants/:id", getVariantDetail);

export default router;
