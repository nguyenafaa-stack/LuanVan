import React from "react";
import HeroSection from "../components/HeroSection";
import ProductList from "./ProductList";

const Home = () => {
  return (
    <div className="homepage">
      <HeroSection />

      <div className="container mb-5">
        <div className="row text-center g-4">
          <div className="col-md-4">
            <div className="p-4 border rounded bg-white shadow-sm">
              <i className="bi bi-brush fs-1 text-primary mb-3"></i>
              <h5 className="fw-bold">Tự Do Sáng Tạo</h5>
              <p className="text-muted small mb-0">
                Thiết kế theo ý muốn của bạn trên mọi sản phẩm.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-4 border rounded bg-white shadow-sm">
              <i className="bi bi-truck fs-1 text-primary mb-3"></i>
              <h5 className="fw-bold">Giao Hàng Nhanh</h5>
              <p className="text-muted small mb-0">
                Đảm bảo quà tặng đến tay đúng dịp ý nghĩa.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-4 border rounded bg-white shadow-sm">
              <i className="bi bi-patch-check fs-1 text-primary mb-3"></i>
              <h5 className="fw-bold">Chất Lượng In Cao Cấp</h5>
              <p className="text-muted small mb-0">
                Màu sắc sắc nét, bền bỉ theo thời gian.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold m-0">Sản phẩm nổi bật</h2>
          <hr className="flex-grow-1 ms-3 d-none d-md-block" />
        </div>
        <ProductList />
      </div>
    </div>
  );
};

export default Home;
