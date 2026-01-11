import express from "express";
import * as designController from "../controllers/designController.js";
import { uploadDesignMiddleware } from "../middlewares/uploadMiddleware.js";
const router = express.Router();

router.post("/create", designController.createDesign);
router.get("/", designController.getAllDesigns);
router.post("/link-to-variants", designController.linkDesignToVariants);
router.get("/variant/:variant_id", designController.getDesignsByVariant);
router.put("/:id", designController.updateDesign);
router.post(
  "/upload-temp",
  uploadDesignMiddleware.single("image"),
  designController.uploadTempImage
);

export default router;
