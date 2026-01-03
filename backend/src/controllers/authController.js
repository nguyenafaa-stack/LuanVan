import authService from "../services/authService.js";

export const register = async (req, res) => {
  try {
    const userId = await authService.register(req.body);
    res
      .status(201)
      .json({ success: true, message: "Đăng ký thành công", userId });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await authService.login(email, password);
    res
      .status(200)
      .json({ success: true, message: "Đăng nhập thành công", ...data });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};
