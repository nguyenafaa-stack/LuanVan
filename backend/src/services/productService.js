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

const createProduct = async (productData, images) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const {
      product_name,
      category_id,
      price,
      description,
      stock_quantity,
      template_type,
    } = productData;

    const productSql = `
      INSERT INTO Product (product_name, category_id, price, description, stock_quantity, template_type) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [productResult] = await connection.query(productSql, [
      product_name,
      category_id,
      price,
      description,
      stock_quantity,
      template_type,
    ]);

    const productId = productResult.insertId;

    if (images && images.length > 0) {
      const imageSql = `INSERT INTO Image (product_id, image_url, is_primary, alt_text) VALUES ?`;
      const imageValues = images.map((img) => [
        productId,
        img.image_url,
        img.is_primary || 0,
        img.alt_text || product_name,
      ]);
      await connection.query(imageSql, [imageValues]);
    }

    await connection.commit();
    return productId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = {
  getAllProducts,
  getProductDetail,
  createProduct,
};
