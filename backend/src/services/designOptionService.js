const db = require("../configs/database.js");

const getOptionsByCategoryId = async (categoryId) => {
  const sql = `
        SELECT * FROM Design_Option 
        WHERE category_id = ?
    `;
  const [rows] = await db.query(sql, [categoryId]);
  return rows;
};

const createOption = async (data) => {
  const { template_type, option_type, option_name, image_url, extra_data } =
    data;
  const sql = `INSERT INTO Design_Option (template_type, option_type, option_name, image_url, extra_data) VALUES (?, ?, ?, ?, ?)`;
  const [result] = await db.query(sql, [
    template_type,
    option_type,
    option_name,
    image_url,
    extra_data ? JSON.stringify(extra_data) : null,
  ]);
  return result.insertId;
};

module.exports = {
  getOptionsByCategoryId,
  createOption,
};
