const customerService = require("../services/authService.js");

const handleRegister = async (req, res) => {
  try {
    const userId = await customerService.register(req.body);
    res
      .status(201)
      .json({ success: true, message: "Đăng ký thành công", userId });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await customerService.login(email, password);
    res
      .status(200)
      .json({ success: true, message: "Đăng nhập thành công", ...data });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

module.exports = { handleRegister, handleLogin };
