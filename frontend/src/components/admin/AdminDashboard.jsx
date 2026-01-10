import React from "react";

const AdminDashboard = () => {
  // Dữ liệu giả lập để hiển thị
  const stats = [
    {
      label: "Tổng đơn hàng",
      value: "128",
      color: "primary",
      icon: "bi-cart-check",
    },
    {
      label: "Doanh thu",
      value: "24.500.000đ",
      color: "success",
      icon: "bi-currency-dollar",
    },
    { label: "Sản phẩm", value: "45", color: "warning", icon: "bi-box" },
    { label: "Thiết kế", value: "12", color: "info", icon: "bi-palette" },
  ];

  return (
    <div>
      <h2 className="mb-4 fw-bold">Tổng quan hệ thống</h2>
      <div className="row g-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="col-md-3">
            <div
              className={`card border-0 shadow-sm bg-${stat.color} text-white`}
            >
              <div className="card-body d-flex align-items-center justify-content-between p-4">
                <div>
                  <h6 className="text-uppercase small mb-1">{stat.label}</h6>
                  <h3 className="mb-0 fw-bold">{stat.value}</h3>
                </div>
                <i className={`bi ${stat.icon} fs-1 opacity-50`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 card border-0 shadow-sm p-4">
        <h5 className="fw-bold mb-3 border-bottom pb-2 text-secondary">
          Hoạt động gần đây
        </h5>
        <ul className="list-group list-group-flush">
          <li className="list-group-item px-0 border-0">
            ✅ Đơn hàng #1204 vừa được thanh toán.
          </li>
          <li className="list-group-item px-0 border-0">
            🆕 Đã thêm mẫu thiết kế "Ly Sứ Chibi Gà Con".
          </li>
          <li className="list-group-item px-0 border-0">
            ⚠️ Sản phẩm "Áo thun Trắng L" sắp hết hàng.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
