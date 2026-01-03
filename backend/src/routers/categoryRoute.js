import express from "express";
const router = express.Router();

import {
  getAllCategorys,
  createCategory,
} from "../controllers/categoryController.js";

router.get("/", getAllCategorys);
router.post("/", createCategory);

export default router;
