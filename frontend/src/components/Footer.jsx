import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white pt-5 pb-4 border-top mt-5">
      <div className="container">
        <div className="row text-start justify-content-center">
          {/* Cột 1: Menu */}
          <div className="col-md-2 col-6 mb-4">
            <h6 className="fw-bold mb-3">Menu</h6>
            <ul className="list-unstyled footer-links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/">Shop</Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/contact">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Cột 2: Categories */}
          <div className="col-md-2 col-6 mb-4">
            <h6 className="fw-bold mb-3">Categories</h6>
            <ul className="list-unstyled footer-links">
              <li>
                <Link to="/">Casual</Link>
              </li>
              <li>
                <Link to="/">Work & Office</Link>
              </li>
              <li>
                <Link to="/">Activewear</Link>
              </li>
              <li>
                <Link to="/">Evening Dresses</Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Resources */}
          <div className="col-md-2 col-6 mb-4">
            <h6 className="fw-bold mb-3">Resources</h6>
            <ul className="list-unstyled footer-links">
              <li>
                <Link to="/contact">Contact Support</Link>
              </li>
              <li>
                <Link to="/">FAQ</Link>
              </li>
              <li>
                <Link to="/">Live Chat</Link>
              </li>
              <li>
                <Link to="/">Returns</Link>
              </li>
            </ul>
          </div>

          {/* Cột 4: Social Media */}
          <div className="col-md-2 col-6 mb-4">
            <h6 className="fw-bold mb-3">Social Media</h6>
            <ul className="list-unstyled footer-links">
              <li>
                <a href="https://facebook.com" target="_blank" rel="noreferrer">
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://twitter.com" target="_blank" rel="noreferrer">
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://pinterest.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  Pinterest
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Line */}
        <div className="row mt-4 pt-4 border-top">
          <div className="col-12 text-center text-muted small">
            <p>Copyright © 2025 mygiftshop-demo | Powered by mygiftshop-demo</p>
          </div>
        </div>
      </div>

      {/* CSS tinh chỉnh để giống hệt ảnh */}
      <style>{`
        .footer-links li {
          margin-bottom: 8px;
        }
        .footer-links a {
          text-decoration: none;
          color: #6c757d; /* Màu xám nhẹ giống ảnh */
          font-size: 14px;
          transition: color 0.2s;
        }
        .footer-links a:hover {
          color: #000; /* Chuyển đen khi hover */
        }
        footer h6 {
          font-size: 15px;
          color: #333;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
