import React, { useState, useEffect, useCallback } from "react";
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Text as KonvaText,
} from "react-konva";
import useImage from "use-image";

// Endpoint mặc định nối URL
const BASE_URL = "http://localhost:3000";

const URLImage = ({ src, onLoad, ...props }) => {
  const [image] = useImage(src, "Anonymous");
  useEffect(() => {
    if (image && onLoad) onLoad(image);
  }, [image, onLoad]);
  return <KonvaImage image={image} {...props} draggable={false} />;
};

const DesignCanvas = ({ designData, userSelections, variantImage }) => {
  const [mockupDim, setMockupDim] = useState({
    width: 500,
    height: 500,
    x: 0,
    y: 0,
  });

  const formatUrl = (url) => {
    if (!url || url.startsWith("http") || url.startsWith("blob:")) return url;
    return `${BASE_URL}/uploads/${
      url.startsWith("products/") ? "" : "products/"
    }${url}`;
  };

  const handleMockupLoad = useCallback((img) => {
    const ratio = img.width / img.height;
    const size = 500;
    // Tính toán để ảnh luôn "Fit" trong khung 500x500
    const w = ratio > 1 ? size : size * ratio;
    const h = ratio > 1 ? size / ratio : size;
    setMockupDim({ width: w, height: h, x: (size - w) / 2, y: (size - h) / 2 });
  }, []);

  if (!designData) return null;

  // Lấy danh sách layer mặt trước
  const layers =
    designData
      .find((s) => s.type === "F")
      ?.detail.filter((l) => l.type !== "image_static")
      .sort((a, b) => a.zIndex - b.zIndex) || [];

  return (
    <div className="d-flex justify-content-center bg-white p-2 rounded border shadow-sm overflow-hidden">
      <Stage width={500} height={500}>
        <Layer>
          {/* Mockup nền (Áo/Ly/Phôi) */}
          <URLImage
            src={variantImage}
            onLoad={handleMockupLoad}
            {...mockupDim}
          />

          {layers.map((item) => {
            const val = userSelections[item.layer];

            if (item.type.includes("image") || item.type.includes("upload")) {
              let imgSrc = "";
              if (item.type.includes("option")) {
                imgSrc = formatUrl(
                  item.options?.find((o) => o.id === val)?.image_url
                );
              } else {
                imgSrc = val;
              }
              return imgSrc ? (
                <URLImage
                  key={item.layer}
                  src={imgSrc}
                  {...item.default_config}
                />
              ) : null;
            }

            if (item.type.includes("text")) {
              const colorOpt = layers.find(
                (l) =>
                  l.type === "color_option" && l.target_layer === item.layer
              );
              const selectedColor = colorOpt?.options?.find(
                (o) => o.id === userSelections[colorOpt.layer]
              )?.color;

              return (
                <KonvaText
                  key={item.layer}
                  {...item.default_config}
                  fill={selectedColor || item.default_config.fill || "#000000"}
                  text={String(val || item.default_config.text || "")}
                />
              );
            }
            return null;
          })}
        </Layer>
      </Stage>
    </div>
  );
};

export default DesignCanvas;
