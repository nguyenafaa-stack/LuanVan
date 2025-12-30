const db = require("../configs/database.js");
const bcrypt = require("bcrypt");

const createAdminAccount = async (adminData) => {
  const { full_name, email, password, phone } = adminData;
  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = `
    INSERT INTO User (full_name, email, password_hash, phone, role) 
    VALUES (?, ?, ?, ?, 'admin')
  `;
  const [result] = await db.query(sql, [
    full_name,
    email,
    hashedPassword,
    phone,
  ]);
  return result.insertId;
};

module.exports = { createAdminAccount };
