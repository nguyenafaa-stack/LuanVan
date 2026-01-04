import React, { useState, useEffect, useCallback } from "react";
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Text as KonvaText,
} from "react-konva";
import useImage from "use-image";

const URLImage = ({ src, onLoad, ...props }) => {
  const [image] = useImage(src, "Anonymous");

  useEffect(() => {
    if (image && onLoad) {
      onLoad(image);
    }
  }, [image, onLoad]);

  return <KonvaImage image={image} {...props} draggable={false} />;
};

const DesignCanvas = ({ designData, userSelections, variantImage }) => {
  const [mockupDimensions, setMockupDimensions] = useState({
    width: 500,
    height: 500,
    x: 0,
    y: 0,
  });

  const formatImageUrl = (url) => {
    if (!url) return "";
    return url.startsWith("http")
      ? url
      : `http://localhost:3000/uploads/products/shirts/${url}`;
  };

  const handleMockupLoad = useCallback((image) => {
    const canvasWidth = 500;
    const canvasHeight = 500;
    const imgRatio = image.width / image.height;
    const canvasRatio = canvasWidth / canvasHeight;

    let newWidth, newHeight, x, y;

    if (imgRatio > canvasRatio) {
      newWidth = canvasWidth;
      newHeight = canvasWidth / imgRatio;
      x = 0;
      y = (canvasHeight - newHeight) / 2;
    } else {
      newHeight = canvasHeight;
      newWidth = canvasHeight * imgRatio;
      x = (canvasWidth - newWidth) / 2;
      y = 0;
    }

    setMockupDimensions((prev) => {
      if (
        prev.width === newWidth &&
        prev.height === newHeight &&
        prev.x === x &&
        prev.y === y
      ) {
        return prev;
      }
      return { width: newWidth, height: newHeight, x, y };
    });
  }, []);

  useEffect(() => {
    setMockupDimensions({
      width: 500,
      height: 500,
      x: 0,
      y: 0,
    });
  }, [variantImage]);

  if (!designData) return null;

  const frontSide = designData.find((side) => side.type === "F");
  const layers = frontSide
    ? frontSide.detail
        .filter((item) => item.type !== "image_static")
        .sort((a, b) => a.zIndex - b.zIndex)
    : [];

  const colorLayers = layers.filter((l) => l.type === "color_option");

  return (
    <div className="d-flex justify-content-center bg-light p-2 rounded border shadow-sm">
      <Stage width={500} height={500}>
        <Layer>
          <URLImage
            src={variantImage}
            onLoad={handleMockupLoad}
            {...mockupDimensions}
          />

          {layers.map((item) => {
            if (item.type === "image_option") {
              const selectedId = userSelections[item.layer];
              const selectedOpt = item.options?.find(
                (o) => o.id === selectedId
              );
              if (!selectedOpt) return null;

              return (
                <URLImage
                  key={item.layer}
                  src={formatImageUrl(selectedOpt.image_url)}
                  {...item.default_config}
                />
              );
            }

            if (item.type === "text") {
              const colorLayer = colorLayers.find(
                (cl) => cl.target_layer === item.layer
              );
              let textColor = item.default_config.fill || "#000000";

              if (colorLayer && userSelections[colorLayer.layer]) {
                const selectedColor = colorLayer.options?.find(
                  (opt) => opt.id === userSelections[colorLayer.layer]
                );
                if (selectedColor) {
                  textColor = selectedColor.color;
                }
              }

              return (
                <KonvaText
                  key={item.layer}
                  {...item.default_config}
                  fill={textColor}
                  text={String(
                    userSelections[item.layer] || item.default_config.text || ""
                  )}
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
