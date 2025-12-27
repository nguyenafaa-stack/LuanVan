import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { BASE_URL } from "../api/axiosInstance";

const Cart = () => {
  const [cart, setCart] = useState(null);

  const fetchCart = () => {
    axiosInstance.get("/cart").then((res) => setCart(res.data.data));
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (itemId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        await axiosInstance.delete(`/cart/${itemId}`);
        fetchCart();
      } catch (err) {
        alert("Lỗi khi xóa sản phẩm: " + err.message);
      }
    }
  };

  if (!cart || cart.items.length === 0)
    return <div className="container mt-5 text-center">Giỏ hàng trống</div>;

  return (
    <div className="container mt-5 bg-white p-4 shadow-sm rounded">
      <h2 className="mb-4 fw-bold text-uppercase border-bottom pb-3">
        Giỏ hàng của bạn
      </h2>
      <div className="table-responsive">
        <table className="table align-middle text-center">
          <thead className="table-light text-uppercase small">
            <tr>
              <th className="text-start" style={{ width: "40%" }}>
                Sản phẩm
              </th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Tổng</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {cart.items.map((item) => {
              // 1. Ưu tiên hiển thị ảnh thiết kế (Base64/URL preview)
              // Nếu không có ảnh thiết kế thì mới hiển thị ảnh mặc định từ database
              const displayImage =
                item.preview_image_url || `${BASE_URL}${item.image_url}`;

              // 2. Giải mã thông tin tùy chỉnh (Màu áo, Chữ in...)
              const customData = item.customization_json;

              return (
                <tr key={item.cart_item_id}>
                  <td className="text-start">
                    <div className="d-flex align-items-center">
                      <img
                        src={displayImage}
                        width="80"
                        height="80"
                        className="me-3 object-fit-cover border rounded bg-light"
                        alt={item.product_name}
                      />
                      <div>
                        <div className="fw-bold text-dark">
                          {item.product_name}
                        </div>
                        {/* HIỂN THỊ TÓM TẮT THIẾT KẾ */}
                        {customData && (
                          <div className="text-muted small mt-1 bg-light p-1 rounded">
                            {customData.shirtColorId && (
                              <span className="d-block">
                                Màu: <strong>{customData.shirtColorId}</strong>
                              </span>
                            )}
                            {customData.shirtText && (
                              <span className="d-block">
                                Chữ: <strong>{customData.shirtText}</strong>
                              </span>
                            )}
                            {customData.userName && (
                              <span className="d-block">
                                Tên in: <strong>{customData.userName}</strong>
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="text-secondary">
                    {Number(item.unit_price).toLocaleString()}đ
                  </td>

                  <td>
                    <span className="badge bg-light text-dark border px-3 py-2">
                      {item.quantity}
                    </span>
                  </td>

                  <td className="fw-bold text-primary">
                    {Number(item.subtotal).toLocaleString()}đ
                  </td>

                  <td>
                    <button
                      className="btn btn-link text-danger text-decoration-none small"
                      onClick={() => handleRemove(item.cart_item_id)}
                    >
                      <i className="bi bi-trash me-1"></i> Xóa
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="text-end mt-4 pt-3 border-top">
        <h4 className="mb-3">
          Tổng cộng:{" "}
          <span className="text-danger fw-bold ms-2">
            {Number(cart.totalAmount).toLocaleString()}đ
          </span>
        </h4>
        <button className="btn btn-dark btn-lg px-5 fw-bold shadow-sm text-uppercase">
          Tiến hành thanh toán
        </button>
      </div>
    </div>
  );
};

export default Cart;
