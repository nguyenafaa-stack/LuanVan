const productService = require("../services/productService");

const getProducts = async (req, res) => {
  try {
    const data = await productService.getAllProducts();

    res.status(200).json({
      success: true,
      message: "Lấy danh sách sản phẩm thành công",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống: " + error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID từ /api/products/:id
    const product = await productService.getProductDetail(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm này",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống: " + error.message,
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
};
