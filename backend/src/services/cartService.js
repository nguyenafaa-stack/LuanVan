const db = require("../configs/database.js");

const addToCart = async (customer_id, product_id, quantity) => {
  try {
    let [carts] = await db.query(
      "SELECT cart_id FROM Cart WHERE customer_id = ?",
      [customer_id]
    );
    let cartId;

    if (carts.length === 0) {
      const [newCart] = await db.query(
        "INSERT INTO Cart (customer_id) VALUES (?)",
        [customer_id]
      );
      cartId = newCart.insertId;
    } else {
      cartId = carts[0].cart_id;
    }

    const [existingItems] = await db.query(
      "SELECT cart_item_id, quantity FROM Cart_item WHERE cart_id = ? AND product_id = ?",
      [cartId, product_id]
    );

    if (existingItems.length > 0) {
      const newQuantity = existingItems[0].quantity + quantity;
      await db.query(
        "UPDATE Cart_item SET quantity = ? WHERE cart_item_id = ?",
        [newQuantity, existingItems[0].cart_item_id]
      );
      return { message: "Đã cập nhật số lượng sản phẩm" };
    } else {
      await db.query(
        "INSERT INTO Cart_item (cart_id, product_id, quantity) VALUES (?, ?, ?)",
        [cartId, product_id, quantity]
      );
      return { message: "Đã thêm sản phẩm vào giỏ hàng" };
    }
  } catch (error) {
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
        (p.price * ci.quantity) AS subtotal,
        i.image_url
      FROM Cart c
      JOIN Cart_item ci ON c.cart_id = ci.cart_id
      JOIN Product p ON ci.product_id = p.product_id
      LEFT JOIN Image i ON p.product_id = i.product_id AND i.is_primary = TRUE
      WHERE c.customer_id = ?
    `;

    const [items] = await db.query(query, [customer_id]);

    const totalAmount = items.reduce(
      (sum, item) => sum + Number(item.subtotal),
      0
    );

    return {
      items,
      totalAmount,
    };
  } catch (error) {
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
