import React, { useState, useEffect } from "react";
import { Stage, Layer, Group, Text } from "react-konva";
import KonvaImageLayer from "./KonvaImageLayer";
import { BASE_URL } from "../api/axiosInstance";

const MugProduct = ({
  product,
  data,
  setData,
  stageRef,
  onAddToCart,
  setIsDesignMode,
}) => {
  const [activeTab, setActiveTab] = useState("real");
  const [mainImage, setMainImage] = useState(
    product.images?.[0]?.image_url || product.image_url || ""
  );

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsDesignMode(tab === "design");
  };

  const CHARACTERS = [
    { id: "bear", label: "Gấu Cowboy", url: `${BASE_URL}/uploads/bear.png` },
    { id: "horse", label: "Ngựa Chiến", url: `${BASE_URL}/uploads/horse.png` },
    { id: "cat", label: "Mèo Quý Tộc", url: `${BASE_URL}/uploads/cat.png` },
  ];

  const FLAGS = [
    { id: "flag_usa", label: "Cờ Mỹ", url: `${BASE_URL}/uploads/usa2.png` },
    {
      id: "flag_france",
      label: "Cờ Pháp",
      url: `${BASE_URL}/uploads/phap.png`,
    },
    {
      id: "flag_vn",
      label: "Cờ Việt Nam",
      url: `${BASE_URL}/uploads/vietnam.png`,
    },
  ];

  return (
    <div className="container mt-5 bg-white p-4 rounded shadow-sm">
      <div className="row">
        <div className="col-md-7 border-end text-center">
          <div className="btn-group w-100 mb-3 shadow-sm">
            <button
              className={`btn ${
                activeTab === "real" ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => handleTabChange("real")}
            >
              Ảnh mẫu thực tế
            </button>
            <button
              className={`btn ${
                activeTab === "design" ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => handleTabChange("design")}
            >
              Tự thiết kế nhân vật
            </button>
          </div>

          <div
            className="preview-box bg-light rounded p-3 d-flex justify-content-center align-items-center"
            style={{ minHeight: "500px" }}
          >
            {activeTab === "real" ? (
              <div className="w-100">
                <img
                  src={`${BASE_URL}${mainImage}`}
                  className="img-fluid rounded shadow-sm"
                  style={{ maxHeight: "400px", objectFit: "contain" }}
                  alt="Sản phẩm mặc định"
                />
              </div>
            ) : (
              <Stage width={500} height={500} ref={stageRef}>
                <Layer>
                  <KonvaImageLayer
                    url={`${BASE_URL}/uploads/Mug02.png`}
                    x={50}
                    y={50}
                    width={400}
                    height={400}
                  />

                  <Group x={180} y={150}>
                    {/* Nhân vật chính */}
                    <KonvaImageLayer
                      url={
                        CHARACTERS.find((c) => c.id === data.characterId)?.url
                      }
                      x={0}
                      y={0}
                      width={140}
                      height={140}
                    />

                    {/* Lá cờ quốc gia (Góc trên bên phải nhân vật) */}
                    <KonvaImageLayer
                      url={FLAGS.find((f) => f.id === data.flagId)?.url}
                      x={100}
                      y={-20}
                      width={50}
                      height={35}
                    />

                    {/* Tên nhân vật in bên dưới */}
                    <Text
                      text={data.userName || ""}
                      x={-30}
                      y={150}
                      width={200}
                      align="center"
                      fontSize={18}
                      fontStyle="bold"
                      fill="#333"
                    />
                  </Group>
                </Layer>
              </Stage>
            )}
          </div>
        </div>

        {/* CỘT BẢNG ĐIỀU KHIỂN TÙY CHỈNH */}
        <div className="col-md-5 ps-lg-5">
          <h2 className="fw-bold text-uppercase">{product.product_name}</h2>
          <h3 className="text-danger mb-4">
            {Number(product.price).toLocaleString()}đ
          </h3>

          <div className="p-4 border rounded bg-white shadow-sm mb-4">
            {/* NHẬP TÊN */}
            <label className="fw-bold small mb-2 d-block text-muted">
              TÊN IN TRÊN LY
            </label>
            <input
              type="text"
              className="form-control mb-4"
              value={data.userName || ""}
              onChange={(e) => {
                setData({ ...data, userName: e.target.value });
                if (activeTab !== "design") handleTabChange("design");
              }}
              placeholder="Nhập tên..."
            />

            {/* CHỌN NHÂN VẬT */}
            <label className="fw-bold small mb-2 d-block text-muted text-uppercase">
              1. Chọn Nhân vật
            </label>
            <div className="d-flex gap-2 mb-4 flex-wrap">
              {CHARACTERS.map((c) => (
                <img
                  key={c.id}
                  src={c.url}
                  onClick={() => {
                    setData({ ...data, characterId: c.id });
                    if (activeTab !== "design") handleTabChange("design");
                  }}
                  className={`border rounded p-1 bg-light ${
                    data.characterId === c.id
                      ? "border-primary border-2 shadow-sm"
                      : ""
                  }`}
                  style={{
                    width: "70px",
                    height: "70px",
                    cursor: "pointer",
                    objectFit: "contain",
                  }}
                  alt={c.label}
                />
              ))}
            </div>

            {/* CHỌN LÁ CỜ */}
            <label className="fw-bold small mb-2 d-block text-muted text-uppercase">
              2. Chọn Quốc kỳ
            </label>
            <div className="d-flex gap-2 flex-wrap">
              {FLAGS.map((f) => (
                <img
                  key={f.id}
                  src={f.url}
                  onClick={() => {
                    setData({ ...data, flagId: f.id });
                    if (activeTab !== "design") handleTabChange("design");
                  }}
                  className={`border rounded p-1 ${
                    data.flagId === f.id
                      ? "border-primary border-2 shadow-sm"
                      : ""
                  }`}
                  style={{
                    width: "70px",
                    height: "45px",
                    cursor: "pointer",
                    objectFit: "cover",
                  }}
                  alt={f.label}
                />
              ))}
            </div>
          </div>

          <button
            onClick={onAddToCart}
            className="btn btn-dark btn-lg w-100 py-3 fw-bold shadow-sm"
          >
            THÊM VÀO GIỎ HÀNG
          </button>
        </div>
      </div>
    </div>
  );
};

export default MugProduct;
