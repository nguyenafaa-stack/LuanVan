import db from "../configs/database.js";

const createSlug = (str) => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/([^0-9a-z-\s])/g, "")
    .replace(/(\s+)/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const createCategoryService = async (categoryData) => {
  const { name, description, status } = categoryData;

  const slug = createSlug(name);

  const existing = await db("categorys").where({ slug }).first();
  if (existing) {
    throw new Error("Danh mục này đã tồn tại (trùng slug)");
  }
  const [insertId] = await db("categorys").insert({
    name,
    slug,
    description,
    status: status || "active",
  });

  return {
    id: insertId,
    message: "Đã thêm danh mục mới thành công",
  };
};

export const getAllCategoriesService = async () => {
  return await db("categorys").select("*").orderBy("name", "asc");
};
