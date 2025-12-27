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
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold text-dark" to="/">
          GOSSBY SHOP
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Sản phẩm
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cart">
                Giỏ hàng <i className="bi bi-cart3"></i>
              </Link>
            </li>

            {token ? (
              <li className="nav-item dropdown ms-lg-3">
                <a
                  className="nav-link dropdown-toggle fw-bold text-primary"
                  href="#"
                  id="userDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Hi, {user?.full_name}
                </a>
                <ul
                  className="dropdown-menu dropdown-menu-end shadow-sm"
                  aria-labelledby="userDropdown"
                >
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      Đăng xuất
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item ms-lg-3">
                  <Link
                    className="btn btn-outline-dark btn-sm me-2"
                    to="/login"
                  >
                    Đăng nhập
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-dark btn-sm" to="/register">
                    Đăng ký
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
