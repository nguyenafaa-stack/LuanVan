const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  // Lấy token từ header Authorization (Bearer <token>)
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Bạn chưa đăng nhập!" });
  }

  try {
    // Giải mã token bằng Secret Key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Gắn thông tin đã giải mã (bao gồm customer_id) vào đối tượng req
    req.user = decoded;

    next(); // Cho phép đi tiếp vào Controller
  } catch (error) {
    return res
      .status(403)
      .json({ success: false, message: "Token không hợp lệ hoặc hết hạn!" });
  }
};

module.exports = verifyToken;
