import express from "express";
import * as designController from "../controllers/designController.js";

const router = express.Router();

router.post("/create", designController.createDesign);
router.get("/", designController.getAllDesigns);
router.post("/link-to-variants", designController.linkDesignToVariants);
router.get("/variant/:variant_id", designController.getDesignsByVariant);

export default router;
