import db from "../configs/database.js";

export const addToCartService = async (cartData) => {
  const { user_id, variant_id, quantity, design_json, preview_image_url } =
    cartData;

  let cart = await db("carts").where({ user_id }).first();
  let cart_id;

  if (!cart) {
    const [id] = await db("carts").insert({ user_id });
    cart_id = id;
  } else {
    cart_id = cart.cart_id;
  }

  const designString =
    design_json && Object.keys(design_json).length > 0
      ? JSON.stringify(design_json, Object.keys(design_json).sort())
      : null;

  const existingItem = await db("cart_items")
    .where({ cart_id, variant_id, design_json: designString })
    .first();

  if (existingItem) {
    await db("cart_items")
      .where({ cart_item_id: existingItem.cart_item_id })
      .update({
        quantity: existingItem.quantity + quantity,
        preview_image_url: preview_image_url || existingItem.preview_image_url,
      });
    return { message: "Đã cập nhật số lượng trong giỏ hàng" };
  } else {
    await db("cart_items").insert({
      cart_id,
      variant_id,
      quantity,
      design_json: designString,
      preview_image_url,
    });
    return { message: "Đã thêm vào giỏ hàng thành công" };
  }
};

export const getCartItemsService = async (user_id) => {
  const query = `
    SELECT 
      ci.cart_item_id,
      ci.quantity,
      ci.design_json,
      ci.preview_image_url,
      v.variant_id,
      v.sku,
      p.name as product_name,
      pri.sale_price,
      pri.base_price,
      (COALESCE(pri.sale_price, pri.base_price) * ci.quantity) as subtotal
    FROM carts c
    JOIN cart_items ci ON c.cart_id = ci.cart_id
    JOIN variants v ON ci.variant_id = v.variant_id
    JOIN products p ON v.product_id = p.product_id
    JOIN prices pri ON v.variant_id = pri.variant_id
    WHERE c.user_id = ?
    ORDER BY ci.created_at DESC
  `;

  const [rows] = await db.raw(query, [user_id]);

  const items = rows.map((item) => {
    let parsedDesign = null;
    if (item.design_json) {
      try {
        parsedDesign = JSON.parse(item.design_json);
      } catch (e) {
        parsedDesign = item.design_json;
      }
    }

    return {
      ...item,
      design_json: parsedDesign,
      price_to_pay: item.sale_price || item.base_price,
    };
  });

  const totalAmount = items.reduce(
    (sum, item) => sum + Number(item.subtotal),
    0
  );

  return { items, totalAmount };
};

export const removeItemFromCartService = async (cart_item_id, user_id) => {
  const deleted = await db("cart_items")
    .whereIn("cart_id", function () {
      this.select("cart_id").from("carts").where({ user_id });
    })
    .andWhere({ cart_item_id })
    .del();

  return deleted > 0;
};
