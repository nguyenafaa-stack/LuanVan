const db = require("../configs/database.js");

const getAllProducts = async () => {
  try {
    const query = `
      SELECT 
        p.product_id, 
        p.product_name, 
        p.price, 
        p.stock_quantity, 
        c.category_name, 
        i.image_url
      FROM Product p
      LEFT JOIN Category c ON p.category_id = c.category_id
      LEFT JOIN Image i ON p.product_id = i.product_id AND i.is_primary = TRUE
      WHERE p.status = 'active'
      ORDER BY p.created_at DESC
    `;
    const [rows] = await db.query(query);
    return rows;
  } catch (error) {
    throw error;
  }
};

const getProductDetail = async (id) => {
  try {
    const productQuery = `
      SELECT p.*, c.category_name 
      FROM Product p
      LEFT JOIN Category c ON p.category_id = c.category_id
      WHERE p.product_id = ?
    `;
    const [products] = await db.query(productQuery, [id]);

    if (products.length === 0) return null;

    const imageQuery = `SELECT image_url, is_primary, alt_text FROM Image WHERE product_id = ?`;
    const [images] = await db.query(imageQuery, [id]);

    return {
      ...products[0],
      images: images,
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllProducts,
  getProductDetail,
};
