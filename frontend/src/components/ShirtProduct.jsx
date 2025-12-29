import React, { useState, useEffect, useRef } from "react";
import {
  Stage,
  Layer,
  Group,
  Text,
  Transformer,
  Image as KonvaImage,
} from "react-konva";
import useImage from "use-image";
import { BASE_URL } from "../api/axiosInstance";

const EditableImage = ({ shapeProps, isSelected, onSelect, onChange, url }) => {
  const shapeRef = useRef();
  const trRef = useRef();
  const [img] = useImage(url, "anonymous");
  useEffect(() => {
    if (isSelected && trRef.current) {
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
          e.cancelBubble = true;
          onSelect();
        }}
        onTap={(e) => {
          e.cancelBubble = true;
          onSelect();
        }}
        onDragEnd={(e) => {
          onChange({ ...shapeProps, x: e.target.x(), y: e.target.y() });
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
        <KonvaImage
          image={img}
          x={0}
          y={0}
          width={shapeProps.width}
          height={shapeProps.height}
        />
      </Group>
      {isSelected && <Transformer ref={trRef} keepRatio={true} />}
    </React.Fragment>
  );
};

const EditableText = ({ shapeProps, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected && trRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <Text
        ref={shapeRef}
        {...shapeProps}
        draggable
        onMouseDown={(e) => {
          e.cancelBubble = true;
          onSelect();
        }}
        onTap={(e) => {
          e.cancelBubble = true;
          onSelect();
        }}
        onDragEnd={(e) => {
          onChange({ ...shapeProps, x: e.target.x(), y: e.target.y() });
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          // Với Text, thay vì đổi width/height, ta đổi fontSize để chữ không bị méo (pixelate)
          const newFontSize = Math.max(10, node.fontSize() * scaleX);

          node.scaleX(1);
          node.scaleY(1);

          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            fontSize: newFontSize,
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          enabledAnchors={[
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right",
          ]} // Chỉ dùng các góc để giữ tỉ lệ
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 30) return oldBox;
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};

const ColoredShirt = ({ url, color }) => {
  const [img] = useImage(url, "anonymous");
  const imgRef = useRef();
  useEffect(() => {
    if (img) imgRef.current.cache();
  }, [img, color]);
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 255, g: 255, b: 255 };
  };
  const rgb = hexToRgb(color);

  return (
    <KonvaImage
      name="shirtBackground"
      ref={imgRef}
      image={img}
      x={0}
      y={0}
      width={500}
      height={550}
      filters={[window.Konva.Filters.RGB]}
      red={rgb.r}
      green={rgb.g}
      blue={rgb.b}
    />
  );
};
const ShirtProduct = ({
  product,
  data,
  setData,
  stageRef,
  onAddToCart,
  setIsDesignMode,
}) => {
  const [activeTab, setActiveTab] = useState("design");
  const [selectedId, setSelectedId] = useState(null);
  const [mainImage, setMainImage] = useState(
    product.images?.[0]?.image_url || product.image_url || ""
  );

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    if (setIsDesignMode) {
      setIsDesignMode(tabName === "design");
    }
  };

  const CHARACTERS = [
    {
      id: "hoaky",
      label: "Hoa Ky",
      main: `${BASE_URL}/uploads/hoa_ky.png`,
    },
    {
      id: "phap",
      label: "Phap",
      main: `${BASE_URL}/uploads/phap.png`,
    },
    {
      id: "vietnam",
      label: "Vietnam",
      main: `${BASE_URL}/uploads/viet_nam.png`,
    },
  ];

  const SHIRT_COLORS = [
    { id: "white", color: "#ffffff", label: "Trắng" },
    { id: "blue", color: "#3498db", label: "Xanh" },
    { id: "red", color: "#e74c3c", label: "Đỏ" },
    { id: "black", color: "#2c3e50", label: "Than" },
    { id: "yellow", color: "#f1c40f", label: "Vàng" },
  ];

  const TEXT_COLORS = [
    { name: "Đen", hex: "#000000" },
    { name: "Trắng", hex: "#ffffff" },
    { name: "Đỏ", hex: "#ff0000" },
    { name: "Vàng", hex: "#ffd700" },
  ];

  const shirtBaseUrl = `${BASE_URL}/uploads/shirt01.png`;
  const selectedChar = data.characterId
    ? CHARACTERS.find((c) => c.id === data.characterId)
    : null;
  const currentColor =
    SHIRT_COLORS.find((c) => c.id === data.shirtColorId)?.color || "#ffffff";

  const handleStageMouseDown = (e) => {
    const clickedOnStage = e.target === e.target.getStage();
    const clickedOnBackground = e.target.name() === "shirtBackground";
    if (clickedOnStage || clickedOnBackground) setSelectedId(null);
  };

  useEffect(() => {
    if (setIsDesignMode) setIsDesignMode(activeTab === "design");
  }, []);

  // giao diện
  return (
    <div className="container mt-5 bg-white p-4 rounded shadow-sm">
      <div className="row">
        <div className="col-md-7 border-end">
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
                  <ColoredShirt url={shirtBaseUrl} color={currentColor} />
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
                      onChange={(newProps) =>
                        setData({
                          ...data,
                          imagePos: { x: newProps.x, y: newProps.y },
                          imageSize: {
                            width: newProps.width,
                            height: newProps.height,
                          },
                        })
                      }
                    />
                  )}
                  {data.shirtText && (
                    <EditableText
                      isSelected={selectedId === "text"}
                      onSelect={() => setSelectedId("text")}
                      shapeProps={{
                        text: data.shirtText,
                        x: data.textPos?.x || 175,
                        y: data.textPos?.y || 260,
                        fontSize: data.textSize || 28,
                        fontStyle: "bold",
                        fill: data.textColor || "#000000",
                      }}
                      onChange={(newProps) =>
                        setData({
                          ...data,
                          textPos: { x: newProps.x, y: newProps.y },
                          textSize: newProps.fontSize,
                        })
                      }
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
              </div>
            )}
          </div>
        </div>

        <div className="col-md-5 ps-lg-5 mt-4 mt-md-0">
          <h2 className="fw-bold">{product.product_name}</h2>
          <h3 className="text-danger mb-4">
            {Number(product.price).toLocaleString()}đ
          </h3>
          <div className="p-4 border rounded bg-white shadow-sm mb-4">
            <div className="mb-4">
              <label className="fw-bold small mb-2 d-block text-muted">
                MÀU ÁO
              </label>
              <div className="d-flex gap-3">
                {SHIRT_COLORS.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setData({ ...data, shirtColorId: c.id })}
                    className={`rounded-circle border border-2 ${
                      data.shirtColorId === c.id ? "border-primary" : ""
                    }`}
                    style={{
                      backgroundColor: c.color,
                      width: "30px",
                      height: "30px",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="fw-bold small mb-2 d-block text-muted text-uppercase">
                Nội dung in
              </label>
              <input
                type="text"
                className="form-control border-2"
                value={data.shirtText || ""}
                onChange={(e) => {
                  setData({ ...data, shirtText: e.target.value });
                  if (activeTab !== "design") handleTabChange("design"); // Tự động switch tab
                }}
                placeholder="Nhập chữ..."
              />
            </div>

            <div className="mb-4">
              <label className="fw-bold small mb-2 d-block text-muted text-uppercase">
                Màu chữ
              </label>
              <div className="d-flex gap-2 flex-wrap">
                {TEXT_COLORS.map((tc) => (
                  <div
                    key={tc.hex}
                    onClick={() => setData({ ...data, textColor: tc.hex })}
                    className={`rounded-circle border border-2 ${
                      data.textColor === tc.hex
                        ? "border-dark shadow-sm"
                        : "border-light"
                    }`}
                    style={{
                      backgroundColor: tc.hex,
                      width: "28px",
                      height: "28px",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="fw-bold small mb-2 d-block text-muted text-uppercase">
                Chọn Logo in
              </label>
              <div className="d-flex gap-2 flex-wrap">
                {CHARACTERS.map((char) => (
                  <img
                    key={char.id}
                    src={char.main} // Đường dẫn ảnh từ mảng CHARACTERS
                    alt={char.label}
                    className={`border rounded p-1 ${
                      data.characterId === char.id
                        ? "border-primary border-2 shadow-sm"
                        : "border-light"
                    }`}
                    style={{
                      width: "60px",
                      height: "60px",
                      cursor: "pointer",
                      objectFit: "contain",
                      backgroundColor: "#f8f9fa",
                    }}
                    onClick={() => {
                      setData({ ...data, characterId: char.id }); // Cập nhật state thiết kế
                      if (activeTab !== "design") handleTabChange("design"); // Tự động chuyển tab thiết kế
                    }}
                  />
                ))}

                <div
                  className="border rounded d-flex align-items-center justify-content-center text-danger"
                  style={{
                    width: "60px",
                    height: "60px",
                    cursor: "pointer",
                    fontSize: "20px",
                    backgroundColor: "#fff",
                  }}
                  onClick={() => {
                    setData({ ...data, characterId: null });
                    if (typeof setSelectedId === "function")
                      setSelectedId(null);
                  }}
                  title="Xóa logo"
                >
                  <i className="bi bi-trash"></i>{" "}
                  <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                    Xóa
                  </span>
                </div>
              </div>
            </div>
          </div>
          <button
            className="btn btn-dark btn-lg w-100 py-3 fw-bold shadow"
            onClick={onAddToCart}
          >
            THÊM GIỎ HÀNG
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShirtProduct;
