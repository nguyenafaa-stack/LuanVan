import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top shadow-sm py-3">
      <div className="container">
        {/* Brand logo với font-weight mạnh hơn để cân bằng với Hero Text */}
        <Link
          className="navbar-brand fw-bold text-dark fs-4"
          to="/"
          style={{ letterSpacing: "1px" }}
        >
          MY<span className="text-warning">GIFT</span>SHOP
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Nav links với khoảng cách rộng hơn, font nhẹ nhàng hơn */}
          <ul className="navbar-nav ms-auto align-items-center fw-medium">
            <li className="nav-item px-2">
              <Link className="nav-link" to="/">
                Sản phẩm
              </Link>
            </li>
            <li className="nav-item px-2">
              <Link className="nav-link" to="/about">
                Giới thiệu
              </Link>
            </li>
            <li className="nav-item px-2">
              <Link className="nav-link" to="/contact">
                Liên hệ
              </Link>
            </li>
            <li className="nav-item px-2">
              <Link className="nav-link position-relative" to="/cart">
                Giỏ hàng <i className="bi bi-cart3"></i>
              </Link>
            </li>

            {token ? (
              <li className="nav-item dropdown ms-lg-3">
                <a
                  className="nav-link dropdown-toggle fw-bold text-warning"
                  href="#"
                  id="userDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle me-1"></i> {user?.full_name}
                </a>
                <ul
                  className="dropdown-menu dropdown-menu-end border-0 shadow"
                  aria-labelledby="userDropdown"
                >
                  <li>
                    <button
                      className="dropdown-item py-2"
                      onClick={handleLogout}
                    >
                      Đăng xuất
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <div className="d-flex ms-lg-4 gap-2">
                <li className="nav-item">
                  <Link
                    className="btn btn-outline-dark px-4 rounded-pill border-2 fw-bold btn-sm"
                    to="/login"
                  >
                    Đăng nhập
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="btn btn-warning px-4 rounded-pill fw-bold btn-sm shadow-sm"
                    to="/register"
                  >
                    Đăng ký
                  </Link>
                </li>
              </div>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
