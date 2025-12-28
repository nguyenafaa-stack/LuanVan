import React, { useState } from "react";
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
    setIsDesignMode(tab === "design"); // Cập nhật trạng thái tab lên ProductDetail
  };

  const DESIGNS = [
    { id: "d1", url: `${BASE_URL}/uploads/chicken01.webp` },
    { id: "d2", url: `${BASE_URL}/uploads/chicken02.webp` },
    { id: "d3", url: `${BASE_URL}/uploads/chicken03.webp` },
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
                  <KonvaImageLayer
                    url={`${BASE_URL}/uploads/Mug02.png`}
                    x={0}
                    y={0}
                    width={400}
                    height={400}
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
