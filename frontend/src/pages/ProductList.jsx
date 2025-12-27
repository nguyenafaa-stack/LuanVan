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
    <div className="container mt-5 bg-white">
      <h2 className="mb-4 pb-2 border-bottom fw-bold text-uppercase">
        Sản phẩm mới
      </h2>
      <div className="row">
        {products.map((product) => (
          <div key={product.product_id} className="col-md-3 mb-4">
            <div className="card h-100 border-light shadow-sm">
              <img
                src={`${BASE_URL}${product.image_url}`}
                className="card-img-top p-1"
                alt={product.product_name}
                style={{
                  height: "200px",
                  objectFit: "contain",
                  backgroundColor: "#fff",
                }}
              />
              <div className="card-body d-flex flex-column">
                <h6 className="card-title fw-bold text-dark">
                  {product.product_name}
                </h6>
                <p className="card-text text-danger fw-bold">
                  {Number(product.price).toLocaleString()}đ
                </p>
                <Link
                  to={`/product/${product.product_id}`}
                  className="btn btn-outline-dark btn-sm mt-auto"
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
