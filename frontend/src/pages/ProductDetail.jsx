import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Stage, Layer, Image as KonvaImage, Text, Group } from "react-konva";
import useImage from "use-image";
import axiosInstance, { BASE_URL } from "../api/axiosInstance";

const MUG_MOCKUP_URL = `${BASE_URL}/uploads/Mug02.png`;

const DESIGN_ASSETS = [
  { id: "d1", url: `${BASE_URL}/uploads/chicken01.webp`, label: "Gà 01" },
  {
    id: "d2",
    url: `${BASE_URL}/uploads/chicken02.webp`,
    label: "Gà 02",
  },
  {
    id: "d3",
    url: `${BASE_URL}/uploads/chicken03.webp`,
    label: "Gà 03",
  },
];

const KonvaImageLayer = ({ url, x, y, width, height }) => {
  const [image] = useImage(url, "Anonymous");
  return <KonvaImage image={image} x={x} y={y} width={width} height={height} />;
};

const ProductDetail = () => {
  const { id } = useParams();
  const stageRef = useRef(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // State để chuyển đổi giữa xem Ảnh thật và xem Thiết kế
  const [viewMode, setViewMode] = useState("real"); // "preview" hoặc "real"
  const [activeRealImg, setActiveRealImg] = useState("");

  const [personalization, setPersonalization] = useState({
    userName: "Tên của bạn",
    selectedDesign: DESIGN_ASSETS[0],
  });

  useEffect(() => {
    axiosInstance
      .get(`/products/${id}`)
      .then((res) => {
        const data = res.data.data;
        setProduct(data);
        if (data.images?.length > 0) {
          setActiveRealImg(data.images[0].image_url);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    const designDataUrl = stageRef.current.toDataURL();
    try {
      await axiosInstance.post("/cart/add", {
        product_id: id,
        quantity: 1,
        custom_design: designDataUrl,
        custom_text: personalization.userName,
      });
      alert("Đã thêm vào giỏ hàng!");
    } catch (err) {
      alert("Vui lòng đăng nhập!");
    }
  };

  if (loading)
    return <div className="container mt-5 text-center">Đang tải...</div>;
  if (!product)
    return (
      <div className="container mt-5 text-center">Sản phẩm không tồn tại</div>
    );

  return (
    <div className="container mt-5 mb-5">
      <div className="row bg-white p-4 rounded shadow-sm">
        {/* CỘT TRÁI: GALLERY & PREVIEW */}
        <div className="col-lg-7 text-center border-end">
          {/* Nút chuyển đổi chế độ xem */}
          <div className="btn-group mb-3 w-100 shadow-sm">
            <button
              className={`btn ${
                viewMode === "real" ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => setViewMode("real")}
            >
              <i className="bi bi-image"></i> Ảnh thực tế
            </button>
            <button
              className={`btn ${
                viewMode === "preview" ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => setViewMode("preview")}
            >
              <i className="bi bi-magic"></i> Tự thiết kế
            </button>
          </div>

          <div
            className="preview-container bg-light rounded p-3 d-flex justify-content-center align-items-center"
            style={{ minHeight: "450px" }}
          >
            {viewMode === "real" ? (
              /* CHẾ ĐỘ XEM ẢNH THẬT TỪ DATABASE */
              <div className="w-100">
                <img
                  src={`${BASE_URL}${activeRealImg}`}
                  className="img-fluid rounded border shadow-sm mb-3"
                  alt="Real product"
                  style={{ maxHeight: "350px", objectFit: "contain" }}
                />
                <div className="d-flex justify-content-center gap-2 overflow-auto py-2">
                  {product.images?.map((img, idx) => (
                    <img
                      key={idx}
                      src={`${BASE_URL}${img.image_url}`}
                      className={`img-thumbnail ${
                        activeRealImg === img.image_url
                          ? "border-primary shadow-sm"
                          : ""
                      }`}
                      style={{
                        width: "60px",
                        height: "60px",
                        cursor: "pointer",
                        objectFit: "cover",
                      }}
                      onClick={() => setActiveRealImg(img.image_url)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              /* CHẾ ĐỘ THIẾT KẾ (KONVA) */
              <Stage width={400} height={400} ref={stageRef}>
                <Layer>
                  <KonvaImageLayer
                    url={MUG_MOCKUP_URL}
                    x={0}
                    y={0}
                    width={400}
                    height={400}
                  />

                  {/* Chỉ render Group thiết kế khi selectedDesign tồn tại */}
                  {personalization.selectedDesign && (
                    <Group x={165} y={130}>
                      <KonvaImageLayer
                        url={personalization.selectedDesign.url}
                        x={0}
                        y={0}
                        width={120}
                        height={120}
                      />
                      <Text
                        text={personalization.userName}
                        x={-40}
                        y={140}
                        width={200}
                        align="center"
                        fontSize={20}
                        fontStyle="bold"
                        fill="#333"
                      />
                    </Group>
                  )}
                </Layer>
              </Stage>
            )}
          </div>
        </div>

        {/* CỘT PHẢI: TÙY CHỈNH & THÔNG TIN */}
        <div className="col-lg-5 ps-lg-5 mt-4 mt-lg-0">
          <h2 className="fw-bold">{product.product_name}</h2>
          <h3 className="text-danger mb-4">
            {Number(product.price).toLocaleString()}đ
          </h3>

          <div className="personalize-box p-4 border rounded bg-white shadow-sm mb-4">
            <h6 className="fw-bold text-dark mb-4 border-bottom pb-2">
              <i className="bi bi-palette-fill text-primary"></i> TÙY CHỈNH
              THIẾT KẾ
            </h6>

            <div className="mb-4">
              <label className="form-label small fw-bold text-muted">
                NHẬP TÊN IN LÊN CỐC
              </label>
              <input
                type="text"
                className="form-control form-control-lg border-primary"
                value={personalization.userName}
                onChange={(e) => {
                  setPersonalization({
                    ...personalization,
                    userName: e.target.value,
                  });
                  setViewMode("preview"); // Tự động chuyển sang preview khi khách gõ tên
                }}
                maxLength={20}
              />
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold text-muted">
                CHỌN BIỂU TƯỢNG
              </label>
              <div className="d-flex gap-3 flex-wrap">
                {DESIGN_ASSETS.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setPersonalization({
                        ...personalization,
                        selectedDesign: item,
                      });
                      setViewMode("preview"); // Tự động chuyển sang preview khi chọn thiết kế
                    }}
                    className={`border rounded-circle p-2 bg-white transition-all ${
                      personalization.selectedDesign.id === item.id
                        ? "border-primary border-3 scale-110 shadow"
                        : "border-light opacity-75"
                    }`}
                    style={{
                      cursor: "pointer",
                      width: "70px",
                      height: "70px",
                      transition: "0.2s",
                    }}
                  >
                    <img
                      src={item.url}
                      alt={item.label}
                      className="img-fluid"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="text-muted mb-4 fs-6">{product.description}</p>

          <button
            onClick={handleAddToCart}
            className="btn btn-primary btn-lg w-100 py-3 fw-bold shadow"
          >
            <i className="bi bi-cart-plus-fill me-2"></i> THÊM VÀO GIỎ HÀNG
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
