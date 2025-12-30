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

const addProduct = async (req, res) => {
  try {
    const { product_name, category_id, price, images, ...rest } = req.body;

    if (!product_name || !category_id || !price) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin sản phẩm bắt buộc",
      });
    }

    const productId = await productService.createProduct(req.body, images);

    res.status(201).json({
      success: true,
      message: "Thêm sản phẩm thành công",
      productId: productId,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống khi thêm sản phẩm",
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  addProduct,
};
