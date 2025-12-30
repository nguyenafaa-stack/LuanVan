const db = require("../configs/database.js");

const getAllCategory = async () => {
  try {
    const [categorys] = await db.query("SELECT * FROM Category");
    return categorys;
  } catch (error) {
    throw error;
  }
};

const addCategory = async (category_name, description) => {
  try {
    await db.query(
      "INSERT INTO Category (category_name, description) VALUES (?, ?)",
      [category_name, description]
    );
    return { message: "Đã thêm danh mục mới thành công" };
  } catch (error) {
    throw error;
  }
};

module.exports = { getAllCategory, addCategory };
