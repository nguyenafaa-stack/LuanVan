import * as cartService from "../services/cartService.js";

export const postToCart = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const { variant_id, quantity, design_json, preview_image_url } = req.body;

    if (!variant_id || !quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Dữ liệu không hợp lệ (Thiếu variant_id hoặc số lượng)",
      });
    }

    const result = await cartService.addToCartService({
      user_id,
      variant_id,
      quantity,
      design_json,
      preview_image_url,
    });

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi giỏ hàng: " + error.message,
    });
  }
};

export const getCart = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const cartData = await cartService.getCartItemsService(user_id);

    res.status(200).json({
      success: true,
      message: "Lấy giỏ hàng thành công",
      data: cartData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi lấy giỏ hàng: " + error.message,
    });
  }
};

export const deleteCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.user_id;

    const success = await cartService.removeItemFromCartService(id, user_id);

    if (!success) {
      return res.status(404).json({
        success: false,
        message: "Mục này không tồn tại hoặc không thuộc quyền sở hữu của bạn",
      });
    }

    res.status(200).json({
      success: true,
      message: "Đã xóa sản phẩm khỏi giỏ hàng",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa: " + error.message,
    });
  }
};
