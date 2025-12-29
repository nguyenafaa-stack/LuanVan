import React, { useState } from "react";
import { Stage, Layer, Group, Text } from "react-konva";
import KonvaImageLayer from "./KonvaImageLayer";
import { BASE_URL } from "../api/axiosInstance";

// Stage: vật chứa (container) chính cho toàn bộ bản vẽ
// Layer viết sau sẽ nằm trên layer viết trước (Z-index)
// Group: gom nhóm các đối tượng đồ họa (như ảnh và chữ) => thao tác biến đổi (xoay, kéo thả,...) lên nhiều đối tượng cùng lúc

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

  const DESIGNS = [
    { id: "d1", url: `${BASE_URL}/uploads/chicken01.webp` },
    { id: "d2", url: `${BASE_URL}/uploads/chicken02.webp` },
    { id: "d3", url: `${BASE_URL}/uploads/chicken03.webp` },
  ];

  const DESIGNS_FLAG = [
    { id: "f1", url: `${BASE_URL}/uploads/hoa_ky.png` },
    { id: "f2", url: `${BASE_URL}/uploads/phap.png` },
    { id: "f3", url: `${BASE_URL}/uploads/viet_nam.png` },
  ];

  const mugShadowProps = data.hasShadow
    ? {
        shadowColor: "black",
        shadowBlur: 20,
        shadowOffset: { x: 15, y: 15 },
        shadowOpacity: 0.8,
      }
    : {};
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
              Ảnh mẫu
            </button>
            <button
              className={`btn ${
                activeTab === "design" ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => handleTabChange("design")}
            >
              Tự thiết kế
            </button>
          </div>

          <div
            className="preview-box bg-light rounded p-3 d-flex flex-column align-items-center justify-content-center"
            style={{ minHeight: "450px" }}
          >
            {activeTab === "real" ? (
              <img
                src={`${BASE_URL}${mainImage}`}
                className="img-fluid rounded"
                style={{ maxHeight: "350px" }}
                alt="Product"
              />
            ) : (
              <Stage width={400} height={400} ref={stageRef}>
                <Layer>
                  {/* <KonvaImageLayer
                    url={`${BASE_URL}/uploads/Mug02.png`}
                    x={0}
                    y={0}
                    width={400}
                    height={400}
                  /> */}

                  <KonvaImageLayer
                    url={`${BASE_URL}/uploads/Mug02.png`}
                    x={0}
                    y={0}
                    width={400}
                    height={400}
                    {...mugShadowProps}
                  />

                  <KonvaImageLayer
                    url={
                      DESIGNS_FLAG.find((d) => d.id === data.selectedDesignId_2)
                        ?.url
                    }
                    x={280}
                    y={90}
                    width={40}
                    height={30}
                  />

                  <Group x={165} y={135}>
                    <KonvaImageLayer
                      url={
                        DESIGNS.find((d) => d.id === data.selectedDesignId)?.url
                      }
                      x={0}
                      y={0}
                      width={120}
                      height={120}
                    />
                    <Text
                      text={data.userName || ""}
                      x={-40}
                      y={140}
                      width={200}
                      align="center"
                      fontSize={20}
                      fontStyle="bold"
                      fill="#333"
                    />
                  </Group>
                </Layer>
              </Stage>
            )}
          </div>
        </div>

        <div className="col-md-5 ps-lg-5">
          <h2 className="fw-bold">{product.product_name}</h2>
          <h3 className="text-danger mb-4">
            {Number(product.price).toLocaleString()}đ
          </h3>
          <div className="p-4 border rounded bg-white shadow-sm mb-4">
            <label className="fw-bold small mb-2 d-block text-muted">
              TÊN IN TRÊN CỐC
            </label>
            <input
              type="text"
              className="form-control mb-4"
              value={data.userName || ""}
              onChange={(e) => {
                setData({ ...data, userName: e.target.value });
                if (activeTab !== "design") handleTabChange("design");
              }}
            />

            <label className="fw-bold small mb-2 d-block text-muted">
              CHỌN BIỂU TƯỢNG
            </label>
            <div className="d-flex gap-2">
              {DESIGNS.map((d) => (
                <img
                  key={d.id}
                  src={d.url}
                  onClick={() => {
                    setData({ ...data, selectedDesignId: d.id });
                    if (activeTab !== "design") handleTabChange("design");
                  }}
                  className={`border rounded p-1 ${
                    data.selectedDesignId === d.id
                      ? "border-primary border-2 shadow-sm"
                      : ""
                  }`}
                  style={{ width: "65px", cursor: "pointer" }}
                />
              ))}
            </div>

            <label className="fw-bold small mb-2 d-block text-muted mt-4">
              CHỌN LÁ CỜ
            </label>

            <div className="d-flex gap-2">
              {DESIGNS_FLAG.map((d) => (
                <img
                  key={d.id}
                  src={d.url}
                  onClick={() => {
                    setData({ ...data, selectedDesignId_2: d.id });
                    if (activeTab !== "design") handleTabChange("design");
                  }}
                  className={`border rounded p-1 ${
                    data.selectedDesignId_2 === d.id
                      ? "border-primary border-2 shadow-sm"
                      : ""
                  }`}
                  style={{ width: "65px", cursor: "pointer" }}
                />
              ))}
            </div>
            <div className="p-4 border rounded bg-light mb-4 mt-4">
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="shadowSwitch"
                  checked={data.hasShadow || false}
                  onChange={(e) => {
                    setData({ ...data, hasShadow: e.target.checked });
                    if (activeTab !== "design") handleTabChange("design");
                  }}
                />
                <label
                  className="form-check-label fw-bold"
                  htmlFor="shadowSwitch"
                >
                  HIỆU ỨNG ĐỔ BÓNG
                </label>
              </div>
            </div>
          </div>
          <button
            onClick={onAddToCart}
            className="btn btn-dark btn-lg w-100 py-3 fw-bold shadow"
          >
            THÊM GIỎ HÀNG
          </button>
        </div>
      </div>
    </div>
  );
};

export default MugProduct;
