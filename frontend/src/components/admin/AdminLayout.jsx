import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Thanh điều hướng bên trái */}
      <Sidebar />

      {/* Khu vực nội dung chính */}
      <div className="flex-grow-1 bg-light">
        <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom px-4 shadow-sm">
          <span className="navbar-brand fw-bold text-primary">ADMIN PANEL</span>
        </nav>

        <div className="p-4">
          <Outlet /> {/* Nơi render các trang Dashboard, Product, Design... */}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
