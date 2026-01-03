import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance, { BASE_URL } from "../api/axiosInstance.jsx";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/products")
      .then((res) => {
        // Backend mới trả về res.data.data là mảng sản phẩm
        setProducts(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi lấy danh sách sản phẩm:", err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return <div className="text-center mt-5">Đang tải sản phẩm...</div>;

  return (
    <div className="container mt-4">
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
                {/* Kiểm tra nếu có ảnh từ bảng images, không thì dùng ảnh mặc định */}
                <img
                  src={
                    product.image_url
                      ? product.image_url.startsWith("http")
                        ? product.image_url
                        : `http://localhost:3000/uploads/products/shirts/${product.image_url}`
                      : null
                  }
                  className="card-img-top p-3 img-hover"
                  alt={product.product_name}
                  style={{
                    height: "250px",
                    objectFit: "contain",
                    transition: "transform 0.3s ease",
                  }}
                />

                {/* Badge giảm giá nếu có sale_price */}
                {product.sale_price && (
                  <span className="position-absolute top-0 start-0 bg-danger text-white px-2 py-1 m-2 rounded-pill small fw-bold">
                    Sale
                  </span>
                )}
              </div>

              <div className="card-body d-flex flex-column text-center pt-0">
                <h6 className="card-title fw-bold text-dark text-truncate mb-2">
                  {product.product_name}
                </h6>

                <div className="mb-3">
                  <span className="text-danger fw-bold fs-5 me-2">
                    {Number(product.price).toLocaleString()}đ
                  </span>
                </div>

                <Link
                  to={`/product/${product.product_id}`}
                  className="btn btn-dark rounded-pill py-2 fw-bold mt-auto"
                >
                  Xem chi tiết
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
