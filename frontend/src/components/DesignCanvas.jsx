import React, { useState, useEffect, useCallback } from "react";
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Text as KonvaText,
} from "react-konva";
import useImage from "use-image";

const BASE_URL = "http://localhost:3000";

const URLImage = ({ src, onLoad, ...props }) => {
  const [image, status] = useImage(src, "Anonymous");

  useEffect(() => {
    if (image && status === "loaded" && onLoad) onLoad(image);
  }, [image, status, onLoad]);

  if (status !== "loaded") return null;
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
    if (url.startsWith("/uploads")) return `${BASE_URL}${url}`;
    if (url.startsWith("products/")) return `${BASE_URL}/uploads/${url}`;
    return `${BASE_URL}/uploads/design/${url}`;
  };

  const handleMockupLoad = useCallback((img) => {
    const ratio = img.width / img.height;
    const size = 500;
    const w = ratio > 1 ? size : size * ratio;
    const h = ratio > 1 ? size / ratio : size;
    setMockupDim({ width: w, height: h, x: (size - w) / 2, y: (size - h) / 2 });
  }, []);

  if (!designData) return null;

  const layers =
    designData
      .find((s) => s.type === "F")
      ?.detail.filter(
        (l) => l.type !== "image_static" && l.type !== "color_option"
      )
      .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0)) || [];

  return (
    <div className="d-flex justify-content-center bg-white p-2 rounded border shadow-sm overflow-hidden">
      <Stage width={500} height={500}>
        <Layer>
          <URLImage
            src={formatUrl(variantImage)}
            onLoad={handleMockupLoad}
            {...mockupDim}
          />

          {layers.map((item) => {
            if (!item.default_config) return null;

            const selectionValue = userSelections[item.layer];
            const {
              draggable,
              zIndex,
              src: defaultSrc,
              ...safeConfig
            } = item.default_config;

            // IMAGE
            if (item.type.includes("image") || item.type.includes("upload")) {
              let imgSrc = "";

              if (item.type === "image_option") {
                let selectedOpt = item.options?.find(
                  (o) => String(o.id) === String(selectionValue)
                );

                if (!selectedOpt && item.options && item.options.length > 0) {
                  selectedOpt = item.options[0];
                }

                imgSrc = selectedOpt ? formatUrl(selectedOpt.image_url) : "";
              } else {
                imgSrc = selectionValue;
              }

              return imgSrc ? (
                <URLImage
                  key={`${item.layer}-${imgSrc}`}
                  src={imgSrc}
                  {...safeConfig}
                />
              ) : null;
            }

            // TEXT
            if (item.type.includes("text")) {
              const colorLayer = designData
                .find((s) => s.type === "F")
                ?.detail.find(
                  (l) =>
                    l.type === "color_option" && l.target_layer === item.layer
                );

              const selectedColorId = userSelections[colorLayer?.layer];
              const activeColor = colorLayer?.options?.find(
                (o) => String(o.id) === String(selectedColorId)
              )?.color;

              return (
                <KonvaText
                  key={item.layer}
                  {...safeConfig}
                  fill={activeColor || safeConfig.fill || "#000000"}
                  text={String(selectionValue || safeConfig.text || "")}
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
