import db from "../configs/database.js";

export const createDesign = async (data) => {
  const { name, thumbnail_url, design_json } = data;

  const [designId] = await db("designs").insert({
    name,
    thumbnail_url,
    design_json:
      typeof design_json === "string"
        ? design_json
        : JSON.stringify(design_json),
  });

  return { design_id: designId, ...data };
};

export const getDesigns = async () => {
  return await db("designs")
    .select("design_id", "name", "thumbnail_url", "design_json")
    .orderBy("created_at", "desc");
};

export const linkDesignToVariantsService = async (data) => {
  const { design_id, target_ids, type } = data;

  const ids = Array.isArray(target_ids) ? target_ids : [target_ids];

  const insertData = ids.map((id) => ({
    design_id: design_id,
    product_variant_id: id,
    type: type,
  }));

  return await db.transaction(async (trx) => {
    await trx("design_product_variant").insert(insertData);

    return {
      design_id,
      linked_count: ids.length,
      target_type: type,
    };
  });
};

export const getDesignsByVariantService = async (variantId) => {
  // 1. Tìm product_id của variant này để lấy các thiết kế gán cho cấp Product
  const variant = await db("variants")
    .where("variant_id", variantId)
    .select("product_id")
    .first();

  if (!variant) throw new Error("Variant không tồn tại");

  const productId = variant.product_id;

  // 2. Truy vấn lấy tất cả design thỏa mãn 1 trong 2 điều kiện:
  // - Gán trực tiếp cho variant_id (type = 'variant')
  // - Gán cho product_id của variant đó (type = 'product')
  const designs = await db("designs as d")
    .join("design_product_variant as dpv", "d.design_id", "dpv.design_id")
    .where(function () {
      this.where("dpv.product_variant_id", variantId)
        .andWhere("dpv.type", "variant")
        .orWhere("dpv.product_variant_id", productId)
        .andWhere("dpv.type", "product");
    })
    .select("d.design_id", "d.name", "d.design_json", "d.thumbnail_url")
    .distinct(); // Tránh trùng lặp nếu gán cả ở product và variant

  // Parse design_json từ string sang object trước khi trả về cho Frontend
  return designs.map((design) => ({
    ...design,
    design_json:
      typeof design.design_json === "string"
        ? JSON.parse(design.design_json)
        : design.design_json,
  }));
};
