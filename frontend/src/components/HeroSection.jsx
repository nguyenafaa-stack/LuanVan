import React from "react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div
      className="hero-section bg-light py-5 mb-5"
      style={{
        background:
          "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('http://localhost:3000/uploads/hero_section.jpg') no-repeat center center",
        backgroundSize: "cover",
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        color: "#ffffff",
      }}
    >
      <div className="container text-center">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <h1 className="display-3 fw-bold mb-4 animate__animated animate__fadeInDown">
              Quà Tặng Cá Nhân Hóa <br />
              <span className="text-warning">Đậm Chất Riêng</span>
            </h1>
            <p
              className="lead mb-5 animate__animated animate__fadeIn animate__delay-1s"
              style={{ fontSize: "1.5rem" }}
            >
              Tự tay thiết kế những món quà ý nghĩa nhất cho người thân yêu chỉ
              với vài bước đơn giản. Từ áo thun, cốc sứ đến những phụ kiện độc
              đáo.
            </p>
            <div className="d-flex gap-3 justify-content-center animate__animated animate__fadeInUp animate__delay-2s">
              <Link
                to="/"
                className="btn btn-warning btn-lg px-5 py-3 fw-bold shadow"
              >
                THIẾT KẾ NGAY
              </Link>
              <Link
                to="/about"
                className="btn btn-outline-light btn-lg px-5 py-3 fw-bold"
              >
                TÌM HIỂU THÊM
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
