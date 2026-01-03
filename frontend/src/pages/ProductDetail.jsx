import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [selectedVariant, setSelectedVariant] = useState(null);

  const formatImageUrl = (url) => {
    return url.startsWith("http")
      ? url
      : `http://localhost:3000/uploads/products/shirts/${url}`;
  };

  useEffect(() => {
    axiosInstance.get(`/products/${id}`).then((res) => {
      const p = res.data.data;
      setProduct(p);

      // 1. Thiết lập ảnh lớn mặc định là ảnh Product có is_main === 1
      if (p.images?.length > 0) {
        const defaultImg =
          p.images.find(
            (img) => img.is_main === 1 && img.image_type === "product"
          ) ||
          p.images.find((img) => img.image_type === "product") ||
          p.images[0];
        setMainImage(formatImageUrl(defaultImg.url));
      }

      // 2. Thiết lập mặc định Variant đầu tiên
      if (p.variants?.length > 0) {
        const firstV = p.variants[0];
        setSelectedVariant(firstV);
        setSelectedAttributes(firstV.attributes);
      }
    });
  }, [id]);

  // 3. Logic: Cập nhật Variant và tự động đổi ảnh lớn
  useEffect(() => {
    if (product?.variants) {
      const match = product.variants.find(
        (v) =>
          JSON.stringify(v.attributes) === JSON.stringify(selectedAttributes)
      );

      if (match) {
        setSelectedVariant(match);

        // Tìm ảnh của variant tương ứng
        const variantImg = product.images.find(
          (img) =>
            img.imageable_id === match.variant_id &&
            img.image_type === "variant"
        );

        if (variantImg) {
          // Nếu variant có ảnh riêng -> cập nhật ảnh lớn
          setMainImage(formatImageUrl(variantImg.url));
        } else {
          // Fallback: Quay về ảnh Product chính nếu variant không có ảnh riêng
          const productMainImg =
            product.images.find(
              (img) => img.is_main === 1 && img.image_type === "product"
            ) || product.images.find((img) => img.image_type === "product");
          if (productMainImg) setMainImage(formatImageUrl(productMainImg.url));
        }
      } else {
        setSelectedVariant(null);
      }
    }
  }, [selectedAttributes, product]);

  const handleAttributeClick = (key, value) => {
    setSelectedAttributes((prev) => ({ ...prev, [key]: value }));
  };

  if (!product) return <div className="text-center mt-5">Đang tải...</div>;

  return (
    <div className="container mt-5">
      <div className="row">
        {/* BÊN TRÁI: GALLERY ẢNH */}
        <div className="col-md-6">
          {/* Ảnh lớn phía trên */}
          <img
            src={mainImage}
            alt={product.name}
            className="img-fluid w-100 border rounded mb-3 p-3"
            style={{ maxHeight: "500px", objectFit: "contain" }}
          />

          {/* Danh sách chọn ảnh bên dưới - CHỈ HIỂN THỊ ẢNH PRODUCT */}
          <div className="d-flex gap-2 overflow-auto pb-2">
            {product.images
              ?.filter((img) => img.image_type === "product") // Lọc chỉ lấy ảnh của Product
              .map((img, i) => (
                <img
                  key={i}
                  src={formatImageUrl(img.url)}
                  alt="thumb"
                  className={`img-thumbnail ${
                    mainImage === formatImageUrl(img.url)
                      ? "border-primary"
                      : ""
                  }`}
                  style={{
                    width: "70px",
                    height: "70px",
                    cursor: "pointer",
                    objectFit: "cover",
                  }}
                  onClick={() => setMainImage(formatImageUrl(img.url))}
                />
              ))}
          </div>
        </div>

        {/* BÊN PHẢI: THÔNG TIN CHI TIẾT */}
        <div className="col-md-6 ps-md-5">
          <h1 className="fw-bold">{product.name}</h1>

          <h3 className="text-danger my-3">
            {selectedVariant
              ? `${Number(
                  selectedVariant.sale_price || selectedVariant.base_price
                ).toLocaleString()}đ`
              : "---"}
          </h3>

          <hr />

          {/* Chọn thuộc tính (Màu sắc, Kích thước...) */}
          {Object.entries(product.product_attributes).map(([key, values]) => (
            <div key={key} className="mb-4">
              <label className="fw-bold mb-2">
                {key}:{" "}
                <span className="text-primary">{selectedAttributes[key]}</span>
              </label>
              <div className="d-flex gap-2">
                {values.map((val) => (
                  <button
                    key={val}
                    className={`btn ${
                      selectedAttributes[key] === val
                        ? "btn-dark"
                        : "btn-outline-dark"
                    }`}
                    onClick={() => handleAttributeClick(key, val)}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <p
            className={
              selectedVariant?.stock_quantity > 0
                ? "text-success"
                : "text-danger"
            }
          >
            {selectedVariant?.stock_quantity > 0
              ? `Còn hàng: ${selectedVariant.stock_quantity}`
              : "Hết hàng"}
          </p>

          <div className="d-flex gap-3 mt-4">
            <div className="input-group" style={{ width: "120px" }}>
              <button
                className="btn btn-outline-dark"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                -
              </button>
              <input
                type="text"
                className="form-control text-center"
                value={quantity}
                readOnly
              />
              <button
                className="btn btn-outline-dark"
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </button>
            </div>
            <button
              className="btn btn-dark flex-grow-1 fw-bold"
              disabled={!selectedVariant || selectedVariant.stock_quantity <= 0}
            >
              THÊM VÀO GIỎ HÀNG
            </button>
          </div>

          <div className="mt-4 p-3 bg-light rounded">
            <h6>Mô tả sản phẩm:</h6>
            <p className="mb-0 text-muted small">{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
