import db from "../configs/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const saltRounds = 10;

const register = async (userData) => {
  const { full_name, email, password, phone } = userData;

  const existing = await db("users")
    .select("user_id")
    .where("email", email)
    .first();

  if (existing) throw new Error("Email này đã được sử dụng");

  const password_hash = await bcrypt.hash(password, saltRounds);

  const [insertId] = await db("users").insert({
    full_name,
    email,
    password_hash,
    phone,
  });

  return insertId;
};

const login = async (email, password) => {
  const user = await db("users").where("email", email).first();
  if (!user) throw new Error("Email hoặc mật khẩu không chính xác");

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) throw new Error("Email hoặc mật khẩu không chính xác");

  const token = jwt.sign(
    {
      user_id: user.user_id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    token,
    user: {
      id: user.user_id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
    },
  };
};

export default { register, login };
