const db = require("../configs/database.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const saltRounds = 10;

const register = async (userData) => {
  const { full_name, email, password, phone } = userData;

  const [existing] = await db.query(
    "SELECT customer_id FROM Customer WHERE email = ?",
    [email]
  );

  if (existing.length > 0) throw new Error("Email này đã được sử dụng");
  const password_hash = await bcrypt.hash(password, saltRounds);

  const [result] = await db.query(
    "INSERT INTO Customer (full_name, email, password_hash, phone) VALUES (?, ?, ?, ?)",
    [full_name, email, password_hash, phone]
  );
  return result.insertId;
};

const login = async (email, password) => {
  const [customers] = await db.query("SELECT * FROM Customer WHERE email = ?", [
    email,
  ]);
  if (customers.length === 0)
    throw new Error("Email hoặc mật khẩu không chính xác");

  const customer = customers[0];

  const isMatch = await bcrypt.compare(password, customer.password_hash);
  if (!isMatch) throw new Error("Email hoặc mật khẩu không chính xác");

  const token = jwt.sign(
    { customer_id: customer.customer_id, email: customer.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    token,
    user: {
      id: customer.customer_id,
      full_name: customer.full_name,
      email: customer.email,
    },
  };
};

module.exports = { register, login };
