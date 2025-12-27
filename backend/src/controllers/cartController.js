const cartService = require("../services/cartService");

const postToCart = async (req, res) => {
  try {
    const customer_id = req.user.customer_id;

    const { product_id, quantity } = req.body;

    if (!product_id || !quantity || quantity <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Dữ liệu không hợp lệ" });
    }

    const result = await cartService.addToCart(
      customer_id,
      product_id,
      quantity
    );

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi: " + error.message,
    });
  }
};

const getCart = async (req, res) => {
  try {
    const customer_id = req.user.customer_id;

    const cartData = await cartService.getCartItems(customer_id);

    res.status(200).json({
      success: true,
      data: cartData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi lấy giỏ hàng: " + error.message,
    });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const customer_id = req.user.customer_id;
    await cartService.removeItemFromCart(id, customer_id);
    res
      .status(200)
      .json({ success: true, message: "Đã xóa sản phẩm khỏi giỏ hàng" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { postToCart, getCart, deleteCartItem };
