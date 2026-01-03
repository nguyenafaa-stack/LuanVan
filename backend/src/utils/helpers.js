export const createSlug = (str) => {
  if (!str) return "";

  return str
    .toLowerCase() // Chuyển về chữ thường
    .normalize("NFD") // Tách các dấu ra khỏi chữ cái (Ví dụ: á -> a + ´)
    .replace(/[\u0300-\u036f]/g, "") // Xóa các dấu vừa tách
    .replace(/[đĐ]/g, "d") // Xử lý riêng chữ đ
    .replace(/([^0-9a-z-\s])/g, "") // Xóa ký tự đặc biệt (chỉ giữ lại số, chữ, khoảng trắng)
    .replace(/(\s+)/g, "-") // Thay khoảng trắng bằng dấu gạch ngang
    .replace(/-+/g, "-") // Thay nhiều gạch ngang liên tiếp bằng 1 gạch
    .replace(/^-+|-+$/g, ""); // Xóa gạch ngang ở đầu và cuối chuỗi
};
