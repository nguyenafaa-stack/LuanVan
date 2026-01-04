import * as designService from "../services/designService.js";

export const createDesign = async (req, res) => {
  try {
    const { name, design_json, thumbnail_url } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Thiếu thông tin bắt buộc" });
    }

    const result = await designService.createDesign({
      name,
      thumbnail_url,
      design_json,
    });

    res.status(201).json({
      success: true,
      message: "Thêm thiết kế thành công",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllDesigns = async (req, res) => {
  try {
    const designs = await designService.getDesigns();
    res.json({ success: true, data: designs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const linkDesignToVariants = async (req, res) => {
  try {
    const { design_id, target_ids, type } = req.body;

    // Kiểm tra dữ liệu bắt buộc
    if (!design_id || !target_ids || !type) {
      return res.status(400).json({
        success: false,
        message:
          "Thiếu design_id, target_ids (mảng) hoặc type (product/variant)",
      });
    }

    const result = await designService.linkDesignToVariantsService({
      design_id,
      target_ids, // Mảng ID của các variant hoặc product
      type, // 'product' hoặc 'variant'
    });

    res.status(200).json({
      success: true,
      message: `Liên kết thiết kế với ${type} thành công`,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDesignsByVariant = async (req, res) => {
  try {
    const { variant_id } = req.params;

    if (!variant_id) {
      return res.status(400).json({
        success: false,
        message: "Thiếu variant_id",
      });
    }

    const designs = await designService.getDesignsByVariantService(variant_id);

    res.status(200).json({
      success: true,
      message: "Lấy danh sách thiết kế thành công",
      data: designs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
