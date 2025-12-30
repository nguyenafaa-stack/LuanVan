const userService = require("../services/userService.js");

const addAdmin = async (req, res) => {
  try {
    const adminId = await userService.createAdminAccount(req.body);
    res.status(201).json({
      success: true,
      message: "Thêm tài khoản Admin thành công",
      adminId,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { addAdmin };
