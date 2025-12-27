import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

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
    return <div className="container mt-5">Giỏ hàng trống</div>;

  return (
    <div className="container mt-5 bg-white p-4 shadow-sm rounded">
      <h2 className="mb-4 fw-bold">Giỏ hàng của bạn</h2>
      <div className="table-responsive">
        <table className="table align-middle text-center">
          <thead className="table-light">
            <tr>
              <th className="text-start">Sản phẩm</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Tổng</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {cart.items.map((item) => (
              <tr key={item.cart_item_id}>
                <td className="text-start">
                  <img
                    src={item.image_url}
                    width="50"
                    height="50"
                    className="me-3 object-fit-cover border"
                    alt={item.product_name}
                  />
                  <span className="fw-semibold">{item.product_name}</span>
                </td>

                <td>{Number(item.unit_price).toLocaleString()}đ</td>

                <td>{item.quantity}</td>

                <td className="fw-bold">
                  {Number(item.subtotal).toLocaleString()}đ
                </td>

                <td>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleRemove(item.cart_item_id)}
                  >
                    <i className="bi bi-trash"></i> Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-end mt-4">
        <h4>
          Tổng cộng:{" "}
          <span className="text-danger">
            {Number(cart.totalAmount).toLocaleString()}đ
          </span>
        </h4>
        <button className="btn btn-dark btn-lg mt-2 px-5 fw-bold">
          TIẾN HÀNH THANH TOÁN
        </button>
      </div>
    </div>
  );
};

export default Cart;
