const designOptionService = require("../services/designOptionService");

const getOptions = async (req, res) => {
  try {
    const { categoryId } = req.query;

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu danh mục sản phẩm (categoryId)",
      });
    }

    const data = await designOptionService.getOptionsByCategoryId(categoryId);

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addOption = async (req, res) => {
  try {
    const optionId = await designOptionService.createOption(req.body);
    res.status(201).json({ success: true, optionId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getOptions,
  addOption,
};
