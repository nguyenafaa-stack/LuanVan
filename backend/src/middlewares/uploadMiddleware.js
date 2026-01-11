import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Cập nhật đường dẫn trỏ vào thư mục public
    const dir = "public/uploads/design";

    // Kiểm tra và tạo thư mục nếu chưa có (recursive: true giúp tạo cả các thư mục cha nếu cần)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Multer sẽ lưu file vào đây, không gây ảnh hưởng hay xóa các file cũ trong thư mục
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Giữ nguyên logic đặt tên file duy nhất để tránh ghi đè lên các file cũ có cùng tên
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `design-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

export const uploadDesignMiddleware = multer({ storage });
