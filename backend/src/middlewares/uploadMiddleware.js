import multer from "multer";
import path from "path";
import fs from "fs";

// Cấu hình nơi lưu trữ và tên file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Đường dẫn thư mục lưu trữ (Ví dụ: public/uploads/designs)
    const uploadDir = "public/uploads/designs";

    // Tạo thư mục nếu chưa tồn tại
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Đặt tên file: timestamp + tên gốc để tránh trùng lặp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Bộ lọc định dạng file (chỉ cho phép ảnh)
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|webp|svg/;
  const extension = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extension && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Chỉ chấp nhận định dạng ảnh (jpg, png, webp, svg)!"));
  }
};

// Khởi tạo middleware
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Giới hạn 5MB
  },
  fileFilter: fileFilter,
});
