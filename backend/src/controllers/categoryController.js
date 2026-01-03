import * as categoryService from "../services/categoryService.js";

export const getAllCategorys = async (req, res) => {
  try {
    const categorys = await categoryService.getAllCategoriesService();

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

export const createCategory = async (req, res) => {
  try {
    const { name, description, status } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Tên danh mục không được để trống" });
    }

    const result = await categoryService.createCategoryService({
      name,
      description,
      status,
    });

    res.status(201).json({
      success: true,
      message: result.message,
      id: result.id,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Lỗi khi tạo danh mục",
    });
  }
};
