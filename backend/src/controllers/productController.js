import * as productService from "../services/productService.js";

export const getAllProducts = async (req, res) => {
  try {
    const data = await productService.getAllProductsService();

    res.status(200).json({
      success: true,
      message: "Lấy danh sách sản phẩm thành công",
      data: data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống: " + error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductDetailService(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm này",
      });
    }

    res.status(200).json({
      success: true,
      message: "Lấy chi tiết sản phẩm thành công",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống: " + error.message,
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, category_id, variants } = req.body;

    // Validation cơ bản
    if (!name || !category_id || !variants || variants.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin bắt buộc (Tên, danh mục hoặc biến thể)",
      });
    }

    const productId = await productService.createProductService(req.body);

    res.status(201).json({
      success: true,
      message: "Thêm sản phẩm và biến thể thành công",
      productId,
    });
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống: " + error.message,
    });
  }
};

export const addProductImages = async (req, res) => {
  try {
    const { id } = req.params;
    const { images } = req.body;
    const type = req.originalUrl.includes("variants") ? "variant" : "product";

    await productService.uploadImageService(images, id, type);

    res.status(200).json({
      success: true,
      message: `Đã thêm ảnh cho ${type} thành công`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getVariantDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const variant = await productService.getVariantDetailService(id);

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy biến thể này",
      });
    }

    res.status(200).json({
      success: true,
      data: variant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống: " + error.message,
    });
  }
};
