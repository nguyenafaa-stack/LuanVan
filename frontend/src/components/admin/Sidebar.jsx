import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/admin", label: "Tổng quan", icon: "bi-speedometer2" },
    { path: "/admin/products", label: "Sản phẩm", icon: "bi-box-seam" },
    { path: "/admin/designs", label: "Mẫu thiết kế", icon: "bi-palette" },
    { path: "/", label: "Xem cửa hàng", icon: "bi-shop" },
  ];

  return (
    <div
      className="bg-dark text-white border-end shadow"
      style={{ width: "250px" }}
    >
      <div className="p-3 border-bottom border-secondary">
        <h4 className="text-center fw-bold mb-0">MYGIFTSHOP</h4>
      </div>
      <ul className="nav nav-pills flex-column mb-auto p-3 gap-2">
        {menuItems.map((item) => (
          <li key={item.path} className="nav-item">
            <Link
              to={item.path}
              className={`nav-link text-white d-flex align-items-center gap-2 ${
                location.pathname === item.path
                  ? "active bg-primary"
                  : "hover-dark"
              }`}
            >
              <i className={`bi ${item.icon}`}></i>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      <style>{`
        .hover-dark:hover { background-color: rgba(255,255,255,0.1); }
      `}</style>
    </div>
  );
};

export default Sidebar;
