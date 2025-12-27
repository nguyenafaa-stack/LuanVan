import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Group, Text, Transformer } from "react-konva";
import KonvaImageLayer from "./KonvaImageLayer";
import { BASE_URL } from "../api/axiosInstance";

// Component con xử lý Logo có Transformer
const EditableImage = ({ shapeProps, isSelected, onSelect, onChange, url }) => {
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <Group
        ref={shapeRef}
        {...shapeProps}
        draggable
        onMouseDown={(e) => {
          e.cancelBubble = true; // Ngăn stage nhận sự kiện click
          onSelect();
        }}
        onTap={(e) => {
          e.cancelBubble = true;
          onSelect();
        }}
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
          });
        }}
      >
        <KonvaImageLayer
          url={url}
          x={0}
          y={0}
          width={shapeProps.width}
          height={shapeProps.height}
        />
      </Group>
      {isSelected && (
        <Transformer
          ref={trRef}
          rotateEnabled={true}
          keepRatio={true}
          onMouseDown={(e) => (e.cancelBubble = true)}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 20 || newBox.height < 20) return oldBox;
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};

const ShirtProduct = ({ product, data, setData, stageRef, onAddToCart }) => {
  const [activeTab, setActiveTab] = useState("design");
  const [selectedId, setSelectedId] = useState(null);
  const [mainImage, setMainImage] = useState(
    product.images?.[0]?.image_url || product.image_url || ""
  );

  const CHARACTERS = [
    {
      id: "ctu",
      label: "Logo CTU",
      main: `${BASE_URL}/uploads/Logo_Dai_hoc_Can_Tho.png`,
    },
    {
      id: "shirt",
      label: "Logo Shirt",
      main: `${BASE_URL}/uploads/logo-shirt.jpg`,
    },
  ];

  const SHIRT_COLORS = [
    {
      id: "white",
      color: "#ffffff",
      url: `${BASE_URL}/uploads/t-shirt-white.jpg`,
    },
    {
      id: "black",
      color: "#212529",
      url: `${BASE_URL}/uploads/t-shirt-black.jpg`,
    },
    {
      id: "gray",
      color: "#5e6164ff",
      url: `${BASE_URL}/uploads/t-shirt-gray.jpg`,
    },
  ];

  const selectedShirt =
    SHIRT_COLORS.find((c) => c.id === (data.shirtColorId || "white")) ||
    SHIRT_COLORS[0];
  const selectedChar = data.characterId
    ? CHARACTERS.find((c) => c.id === data.characterId)
    : null;

  const handleStageMouseDown = (e) => {
    const clickedOnStage = e.target === e.target.getStage();
    const clickedOnBackground = e.target.name() === "shirtBackground";
    if (clickedOnStage || clickedOnBackground) {
      setSelectedId(null);
    }
  };

  return (
    <div className="container mt-5 bg-white p-4 rounded shadow-sm">
      <div className="row">
        <div className="col-md-7 border-end">
          <div className="btn-group w-100 mb-3 shadow-sm">
            <button
              className={`btn ${
                activeTab === "real" ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => setActiveTab("real")}
            >
              <i className="bi bi-image me-2"></i>Ảnh mẫu
            </button>
            <button
              className={`btn ${
                activeTab === "design" ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => setActiveTab("design")}
            >
              <i className="bi bi-magic me-2"></i>Tự thiết kế
            </button>
          </div>

          <div
            className="preview-box bg-light rounded p-3 d-flex flex-column align-items-center justify-content-center"
            style={{ minHeight: "550px" }}
          >
            {activeTab === "design" ? (
              <Stage
                width={500}
                height={550}
                ref={stageRef}
                onMouseDown={handleStageMouseDown}
                onTouchStart={handleStageMouseDown}
              >
                <Layer>
                  <KonvaImageLayer
                    name="shirtBackground"
                    url={selectedShirt.url}
                    x={0}
                    y={0}
                    width={500}
                    height={550}
                  />
                  {selectedChar && (
                    <EditableImage
                      url={selectedChar.main}
                      isSelected={selectedId === "logo"}
                      onSelect={() => setSelectedId("logo")}
                      shapeProps={{
                        x: data.imagePos?.x || 175,
                        y: data.imagePos?.y || 150,
                        width: data.imageSize?.width || 100,
                        height: data.imageSize?.height || 100,
                      }}
                      onChange={(newProps) => {
                        setData({
                          ...data,
                          imagePos: { x: newProps.x, y: newProps.y },
                          imageSize: {
                            width: newProps.width,
                            height: newProps.height,
                          },
                        });
                      }}
                    />
                  )}
                  {data.shirtText && (
                    <Text
                      text={data.shirtText}
                      x={data.textPos?.x || 175}
                      y={data.textPos?.y || 260}
                      fontSize={28}
                      fontStyle="bold"
                      fill={data.shirtColorId === "black" ? "white" : "black"}
                      draggable
                      onMouseDown={(e) => {
                        e.cancelBubble = true;
                        setSelectedId("text");
                      }}
                      onDragEnd={(e) => {
                        setData({
                          ...data,
                          textPos: { x: e.target.x(), y: e.target.y() },
                        });
                      }}
                    />
                  )}
                </Layer>
              </Stage>
            ) : (
              <div className="w-100 text-center">
                <img
                  src={`${BASE_URL}${mainImage}`}
                  className="img-fluid rounded mb-3"
                  style={{ maxHeight: "450px" }}
                  alt="Real"
                />
                <div className="d-flex justify-content-center gap-2 overflow-auto py-2">
                  {product.images?.map((img, idx) => (
                    <img
                      key={idx}
                      src={`${BASE_URL}${img.image_url}`}
                      className={`img-thumbnail ${
                        mainImage === img.image_url
                          ? "border-primary border-2"
                          : ""
                      }`}
                      style={{
                        width: "60px",
                        height: "60px",
                        cursor: "pointer",
                        objectFit: "cover",
                      }}
                      onClick={() => setMainImage(img.image_url)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          <p className="text-center text-muted small mt-2">
            💡 Click vào áo hoặc vùng trống để tắt khung Edit logo
          </p>
        </div>

        <div className="col-md-5 ps-lg-5 mt-4 mt-md-0">
          <h2 className="fw-bold">{product.product_name}</h2>
          <h3 className="text-danger mb-4">
            {Number(product.price).toLocaleString()}đ
          </h3>
          <div className="p-4 border rounded bg-white shadow-sm mb-4">
            <h6 className="fw-bold text-secondary mb-3 text-uppercase small border-bottom pb-2">
              Tùy chỉnh thiết kế
            </h6>
            <div className="mb-4">
              <label className="fw-bold small mb-2 d-block text-muted">
                MÀU SẮC ÁO
              </label>
              <div className="d-flex gap-3">
                {SHIRT_COLORS.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setData({ ...data, shirtColorId: c.id })}
                    className={`rounded-circle border border-2 ${
                      data.shirtColorId === c.id
                        ? "border-primary shadow"
                        : "border-light"
                    }`}
                    style={{
                      backgroundColor: c.color,
                      width: "35px",
                      height: "35px",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="fw-bold small mb-2 d-block text-muted">
                NHẬP CHỮ
              </label>
              <input
                type="text"
                className="form-control border-2"
                value={data.shirtText || ""}
                onChange={(e) =>
                  setData({ ...data, shirtText: e.target.value })
                }
                placeholder="Nội dung in..."
              />
            </div>
            <div className="mb-2">
              <label className="fw-bold small mb-2 d-block text-muted">
                CHỌN LOGO
              </label>
              <div className="d-flex gap-2">
                {CHARACTERS.map((char) => (
                  <button
                    key={char.id}
                    className={`btn btn-sm ${
                      data.characterId === char.id
                        ? "btn-primary"
                        : "btn-outline-secondary"
                    }`}
                    onClick={() => setData({ ...data, characterId: char.id })}
                  >
                    {char.label}
                  </button>
                ))}
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => {
                    setData({ ...data, characterId: null });
                    setSelectedId(null);
                  }}
                >
                  Xóa Logo
                </button>
              </div>
            </div>
          </div>
          {/* Gắn hàm onAddToCart vào đây */}
          <button
            className="btn btn-dark btn-lg w-100 py-3 fw-bold shadow"
            onClick={onAddToCart}
          >
            <i className="bi bi-cart-plus me-2"></i> THÊM VÀO GIỎ HÀNG
          </button>
          <p className="text-muted mt-4 small border-top pt-3">
            <strong>Mô tả:</strong> {product.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShirtProduct;
