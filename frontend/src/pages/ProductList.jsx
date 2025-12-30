import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance, { BASE_URL } from "../api/axiosInstance.jsx";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/products")
      .then((res) => setProducts(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="container mt-2">
      <div className="row">
        {products.map((product) => (
          <div
            key={product.product_id}
            className="col-6 col-md-4 col-lg-3 mb-4"
          >
            <div className="card h-100 border-0 shadow-sm product-card transition">
              <div
                className="position-relative overflow-hidden"
                style={{ borderRadius: "15px 15px 0 0" }}
              >
                <img
                  src={`${BASE_URL}${product.image_url}`}
                  className="card-img-top p-3 img-hover"
                  alt={product.product_name}
                  style={{
                    height: "250px",
                    objectFit: "contain",
                    transition: "transform 0.3s ease",
                  }}
                />

                {/* Đã xóa bỏ phần render Badge (Custom Mug/Shirt) tại đây */}
              </div>

              <div className="card-body d-flex flex-column text-center pt-0">
                <h6 className="card-title fw-bold text-dark text-truncate mb-2">
                  {product.product_name}
                </h6>
                <p className="card-text text-danger fw-bold fs-5 mb-3">
                  {Number(product.price).toLocaleString()}đ
                </p>
                <Link
                  to={`/product/${product.product_id}`}
                  className="btn btn-dark rounded-pill py-2 fw-bold mt-auto"
                >
                  Thiết kế ngay
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .product-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border-radius: 15px;
        }
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
        .img-hover:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};

export default ProductList;
