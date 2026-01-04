import db from "../configs/database.js";
import { createSlug } from "../utils/helpers.js";

/**
 * @param {Array} images - Mảng các object ảnh [{url, is_main}]
 * @param {Number} id - ID của Product hoặc Variant
 * @param {String} type - 'product' hoặc 'variant'
 */
export const uploadImageService = async (images, id, type) => {
  if (!images || images.length === 0) return;

  const imageData = images.map((img) => ({
    imageable_id: id,
    image_type: type,
    url: img.url,
    is_main: img.is_main || false,
  }));

  // Chèn nhiều dòng cùng lúc để tối ưu hiệu năng
  return await db("images").insert(imageData);
};

export const getAllProductsService = async () => {
  const query = `
    SELECT 
      p.product_id, 
      p.name as product_name, 
      p.slug, 
      c.name as category_name,
      (
          SELECT pri.base_price 
          FROM variants v 
          JOIN prices pri ON v.variant_id = pri.variant_id 
          WHERE v.product_id = p.product_id 
          ORDER BY v.variant_id ASC 
          LIMIT 1
      ) as price,
      (
          SELECT img.url 
          FROM images img 
          WHERE img.imageable_id = p.product_id 
            AND img.image_type = 'product' 
            AND img.is_main = 1 
          LIMIT 1
      ) as image_url
    FROM products p
    LEFT JOIN categorys c ON p.category_id = c.category_id
    WHERE p.is_active = 1
    ORDER BY p.product_id DESC
  `;

  const [rows] = await db.raw(query);
  return rows;
};
export const getProductDetailService = async (id) => {
  const productQuery = `
    SELECT p.*, c.name as category_name
    FROM products p
    LEFT JOIN categorys c ON p.category_id = c.category_id
    WHERE p.product_id = ? AND p.is_active = 1
  `;
  const [productRows] = await db.raw(productQuery, [id]);
  const product = productRows[0];
  if (!product) return null;

  const variantsQuery = `
    SELECT 
      v.variant_id, v.sku, v.stock_quantity,
      pri.base_price, pri.sale_price,
      a.name as attr_name,
      av.value as attr_value
    FROM variants v
    LEFT JOIN prices pri ON v.variant_id = pri.variant_id
    LEFT JOIN variant_attribute_values vav ON v.variant_id = vav.variant_id
    LEFT JOIN attribute_values av ON vav.attribute_value_id = av.attribute_value_id
    LEFT JOIN attributes a ON av.attribute_id = a.attribute_id
    WHERE v.product_id = ?
  `;
  const [variantRows] = await db.raw(variantsQuery, [id]);

  const variantsMap = {};
  const allAttributes = {};

  variantRows.forEach((row) => {
    if (!variantsMap[row.variant_id]) {
      variantsMap[row.variant_id] = {
        variant_id: row.variant_id,
        sku: row.sku,
        stock_quantity: row.stock_quantity,
        base_price: row.base_price,
        sale_price: row.sale_price,
        attributes: {},
      };
    }

    if (row.attr_name && row.attr_value) {
      variantsMap[row.variant_id].attributes[row.attr_name] = row.attr_value;

      if (!allAttributes[row.attr_name]) {
        allAttributes[row.attr_name] = new Set();
      }
      allAttributes[row.attr_name].add(row.attr_value);
    }
  });

  Object.keys(allAttributes).forEach((key) => {
    allAttributes[key] = Array.from(allAttributes[key]);
  });

  const variantsArray = Object.values(variantsMap);
  product.variants = variantsArray;
  product.product_attributes = allAttributes;

  // CẬP NHẬT: Lấy cả ảnh sản phẩm và ảnh variant
  const variantIds = variantsArray.map((v) => v.variant_id);
  const imagesQuery = `
    SELECT url, is_main, imageable_id, image_type 
    FROM images 
    WHERE (imageable_id = ? AND image_type = 'product')
       OR (imageable_id IN (${
         variantIds.length > 0 ? variantIds.join(",") : "0"
       }) AND image_type = 'variant')
    ORDER BY is_main DESC
  `;
  const [images] = await db.raw(imagesQuery, [id]);
  product.images = images;

  return product;
};

export const createProductService = async (productData) => {
  const { name, category_id, description, is_active, variants } = productData;
  const slug = createSlug(name);

  return await db.transaction(async (trx) => {
    const [productId] = await trx("products").insert({
      name,
      slug,
      category_id,
      description,
      is_active: is_active ?? 1,
    });

    if (variants && variants.length > 0) {
      for (const variant of variants) {
        const [variantId] = await trx("variants").insert({
          product_id: productId,
          sku: variant.sku,
          stock_quantity: variant.stock_quantity || 0,
        });

        await trx("prices").insert({
          variant_id: variantId,
          base_price: variant.base_price,
          sale_price: variant.sale_price || null,
        });

        if (
          variant.attribute_value_ids &&
          variant.attribute_value_ids.length > 0
        ) {
          const attrValues = variant.attribute_value_ids.map((attrId) => ({
            variant_id: variantId,
            attribute_value_id: attrId,
          }));

          await trx("variant_attribute_values").insert(attrValues);
        }
      }
    }

    return productId;
  });
};

export const getVariantDetailService = async (variantId) => {
  const variantQuery = `
    SELECT 
      v.variant_id, v.product_id, v.sku, v.stock_quantity,
      p.name as product_name,
      pri.base_price, pri.sale_price
    FROM variants v
    JOIN products p ON v.product_id = p.product_id
    LEFT JOIN prices pri ON v.variant_id = pri.variant_id
    WHERE v.variant_id = ?
  `;

  const [rows] = await db.raw(variantQuery, [variantId]);
  const variant = rows[0];

  if (!variant) return null;

  const attrQuery = `
    SELECT CONCAT(a.name, ': ', av.value) as attr
    FROM variant_attribute_values vav
    JOIN attribute_values av ON vav.attribute_value_id = av.attribute_value_id
    JOIN attributes a ON av.attribute_id = a.attribute_id
    WHERE vav.variant_id = ?
  `;
  const [attrs] = await db.raw(attrQuery, [variantId]);
  variant.attributes_text = attrs.map((row) => row.attr).join(", ");

  const imagesQuery = `
    SELECT url, is_main 
    FROM images 
    WHERE imageable_id = ? AND image_type = 'variant'
    ORDER BY is_main DESC
  `;
  const [images] = await db.raw(imagesQuery, [variantId]);
  variant.images = images;

  return variant;
};
