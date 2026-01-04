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
  const variant = await db("variants")
    .where("variant_id", variantId)
    .select("product_id")
    .first();

  if (!variant) throw new Error("Variant không tồn tại");

  const productId = variant.product_id;

  const designs = await db("designs as d")
    .join("design_product_variant as dpv", "d.design_id", "dpv.design_id")
    .where(function () {
      this.where("dpv.product_variant_id", variantId)
        .andWhere("dpv.type", "variant")
        .orWhere("dpv.product_variant_id", productId)
        .andWhere("dpv.type", "product");
    })
    .select("d.design_id", "d.name", "d.design_json", "d.thumbnail_url")
    .distinct();

  return designs.map((design) => ({
    ...design,
    design_json:
      typeof design.design_json === "string"
        ? JSON.parse(design.design_json)
        : design.design_json,
  }));
};

export const updateDesignService = async (id, data) => {
  const { name, thumbnail_url, design_json } = data;
  const updateData = {
    name,
    thumbnail_url,
  };

  if (design_json !== undefined) {
    updateData.design_json =
      typeof design_json === "string"
        ? design_json
        : JSON.stringify(design_json);
  }

  const rowsAffected = await db("designs")
    .where("design_id", id)
    .update(updateData);

  if (rowsAffected === 0) {
    throw new Error("Không tìm thấy mẫu thiết kế để cập nhật");
  }

  return { design_id: id, ...data };
};
