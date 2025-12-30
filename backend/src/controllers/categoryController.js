const categoryService = require("../services/categoryService.js");

const getAllCategory = async (req, res) => {
  try {
    const categorys = await categoryService.getAllCategory();

    res.status(200).json({
      success: true,
      message: "Lấy danh sách danh mục thành công",
      data: categorys,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống",
    });
  }
};

const addCategory = async (req, res) => {
  try {
    const { category_name, description } = req.body;

    if (!category_name || !description) {
      return res
        .status(400)
        .json({ success: false, message: "Dữ liệu không hợp lệ" });
    }

    const result = await categoryService.addCategory(
      category_name,
      description
    );

    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống",
    });
  }
};

module.exports = { getAllCategory, addCategory };
