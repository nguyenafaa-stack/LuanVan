const db = require("../configs/database.js");

const addToCart = async (
  customer_id,
  product_id,
  quantity,
  customization_json,
  preview_image_url
) => {
  try {
    // 1. Lấy hoặc tạo Cart ID
    let [carts] = await db.query(
      "SELECT cart_id FROM Cart WHERE customer_id = ?",
      [customer_id]
    );
    let cartId =
      carts.length === 0
        ? (
            await db.query("INSERT INTO Cart (customer_id) VALUES (?)", [
              customer_id,
            ])
          )[0].insertId
        : carts[0].cart_id;

    // 2. Chuẩn hóa chuỗi JSON để so sánh chính xác
    // Sắp xếp các key trong Object trước khi stringify giúp tránh việc cùng 1 thiết kế nhưng chuỗi khác nhau
    const customDataString =
      customization_json && Object.keys(customization_json).length > 0
        ? JSON.stringify(
            customization_json,
            Object.keys(customization_json).sort()
          )
        : null;

    // 3. Logic kiểm tra trùng lặp để quyết định Cộng dồn hay Thêm mới
    let existingItemId = null;

    if (customDataString) {
      // Tìm sản phẩm có thiết kế trùng khớp hoàn toàn
      const [existingItems] = await db.query(
        "SELECT cart_item_id FROM Cart_item WHERE cart_id = ? AND product_id = ? AND customization_json = ?",
        [cartId, product_id, customDataString]
      );
      if (existingItems.length > 0)
        existingItemId = existingItems[0].cart_item_id;
    } else {
      // Tìm sản phẩm mặc định (customization_json IS NULL)
      const [existingDefault] = await db.query(
        "SELECT cart_item_id FROM Cart_item WHERE cart_id = ? AND product_id = ? AND customization_json IS NULL",
        [cartId, product_id]
      );
      if (existingDefault.length > 0)
        existingItemId = existingDefault[0].cart_item_id;
    }

    // 4. Thực thi lệnh tương ứng
    if (existingItemId) {
      // CỘNG DỒN SỐ LƯỢNG
      await db.query(
        "UPDATE Cart_item SET quantity = quantity + ? WHERE cart_item_id = ?",
        [quantity, existingItemId]
      );
      return { message: "Đã cập nhật số lượng sản phẩm trong giỏ hàng" };
    } else {
      // THÊM DÒNG MỚI
      await db.query(
        "INSERT INTO Cart_item (cart_id, product_id, quantity, customization_json, preview_image_url) VALUES (?, ?, ?, ?, ?)",
        [cartId, product_id, quantity, customDataString, preview_image_url]
      );
      return { message: "Đã thêm sản phẩm mới vào giỏ hàng" };
    }
  } catch (error) {
    console.error("Lỗi Service AddToCart:", error);
    throw error;
  }
};

const getCartItems = async (customer_id) => {
  try {
    const query = `
      SELECT 
        ci.cart_item_id,
        p.product_id,
        p.product_name,
        p.price AS unit_price,
        ci.quantity,
        ci.customization_json,
        ci.preview_image_url,
        (p.price * ci.quantity) AS subtotal,
        i.image_url AS default_image
      FROM Cart c
      JOIN Cart_item ci ON c.cart_id = ci.cart_id
      JOIN Product p ON ci.product_id = p.product_id
      LEFT JOIN Image i ON p.product_id = i.product_id AND i.is_primary = TRUE
      WHERE c.customer_id = ?
      ORDER BY ci.added_at DESC
    `;

    const [rows] = await db.query(query, [customer_id]);

    // Xử lý dữ liệu trả về
    const items = rows.map((item) => {
      // Chuyển chuỗi JSON từ DB về lại Object để Frontend dễ dùng
      let customDetails = null;
      try {
        customDetails = item.customization_json
          ? JSON.parse(item.customization_json)
          : null;
      } catch (e) {
        customDetails = item.customization_json;
      }

      return {
        ...item,
        customization_json: customDetails,
        // Nếu có ảnh preview (thiết kế riêng) thì dùng, không thì dùng ảnh mặc định
        display_image: item.preview_image_url || item.default_image,
      };
    });

    const totalAmount = items.reduce(
      (sum, item) => sum + Number(item.subtotal),
      0
    );

    return {
      items,
      totalAmount,
    };
  } catch (error) {
    console.error("Lỗi Get Cart Items:", error);
    throw error;
  }
};

const removeItemFromCart = async (cart_item_id, customer_id) => {
  try {
    // Kiểm tra xem item đó có thuộc về customer này không trước khi xóa để bảo mật
    const query = `
      DELETE ci FROM Cart_item ci
      JOIN Cart c ON ci.cart_id = c.cart_id
      WHERE ci.cart_item_id = ? AND c.customer_id = ?
    `;
    const [result] = await db.query(query, [cart_item_id, customer_id]);
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};

module.exports = { addToCart, getCartItems, removeItemFromCart };
