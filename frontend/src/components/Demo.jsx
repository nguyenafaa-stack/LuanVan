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

  return <KonvaImage image={image} {...props} />;
};

const DesignCanvas = ({ designData, userSelections, variantImage }) => {
  const [mockupDimensions, setMockupDimensions] = useState({
    width: 500,
    height: 500,
    x: 0,
    y: 0,
  });
  const [debugInfo, setDebugInfo] = useState(null);

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

  // Handler khi kéo thả phần tử
  const handleDragMove = (layerName, e) => {
    const node = e.target;
    setDebugInfo({
      layer: layerName,
      x: Math.round(node.x()),
      y: Math.round(node.y()),
      width: Math.round(node.width()),
      height: Math.round(node.height()),
    });
  };

  // Handler khi kết thúc kéo thả
  const handleDragEnd = (layerName, e) => {
    const node = e.target;
    const info = {
      layer: layerName,
      x: Math.round(node.x()),
      y: Math.round(node.y()),
      width: Math.round(node.width()),
      height: Math.round(node.height()),
    };

    console.log("=".repeat(50));
    console.log(`Layer: ${info.layer}`);
    console.log(`Position: x=${info.x}, y=${info.y}`);
    console.log(`Size: width=${info.width}, height=${info.height}`);
    console.log("JSON Config:");
    console.log(
      JSON.stringify(
        {
          x: info.x,
          y: info.y,
          width: info.width,
          height: info.height,
        },
        null,
        2
      )
    );
    console.log("=".repeat(50));
  };

  if (!designData) return null;

  const frontSide = designData.find((side) => side.type === "F");
  const layers = frontSide
    ? frontSide.detail
        .filter((item) => item.type !== "image_static")
        .sort((a, b) => a.zIndex - b.zIndex)
    : [];

  // Tìm layer màu chữ nếu có
  const colorLayers = layers.filter((l) => l.type === "color_option");

  return (
    <div>
      <div className="d-flex justify-content-center bg-light p-2 rounded border shadow-sm">
        <Stage width={500} height={500}>
          <Layer>
            <URLImage
              src={variantImage}
              onLoad={handleMockupLoad}
              {...mockupDimensions}
              draggable={false}
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
                    draggable={true}
                    onDragMove={(e) => handleDragMove(item.layer, e)}
                    onDragEnd={(e) => handleDragEnd(item.layer, e)}
                  />
                );
              }

              if (item.type === "text") {
                // Tìm màu chữ được chọn
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
                      userSelections[item.layer] ||
                        item.default_config.text ||
                        ""
                    )}
                    draggable={true}
                    onDragMove={(e) => handleDragMove(item.layer, e)}
                    onDragEnd={(e) => handleDragEnd(item.layer, e)}
                  />
                );
              }
              return null;
            })}
          </Layer>
        </Stage>
      </div>

      {/* Hiển thị thông tin debug real-time */}
      {debugInfo && (
        <div className="mt-3 p-3 bg-info bg-opacity-10 rounded">
          <h6 className="fw-bold mb-2">🎯 Debug Info (Real-time)</h6>
          <div className="font-monospace small">
            <div>
              <strong>Layer:</strong> {debugInfo.layer}
            </div>
            <div>
              <strong>X:</strong> {debugInfo.x}px
            </div>
            <div>
              <strong>Y:</strong> {debugInfo.y}px
            </div>
            <div>
              <strong>Width:</strong> {debugInfo.width}px
            </div>
            <div>
              <strong>Height:</strong> {debugInfo.height}px
            </div>
          </div>
          <div
            className="mt-2 p-2 bg-dark text-light rounded font-monospace"
            style={{ fontSize: "0.75rem" }}
          >
            <pre className="m-0">
              {`{
                  "x": ${debugInfo.x},
                  "y": ${debugInfo.y},
                  "width": ${debugInfo.width},
                  "height": ${debugInfo.height}
              }`}
            </pre>
          </div>
        </div>
      )}

      {/* Hướng dẫn sử dụng */}
      <div className="mt-2 alert alert-warning small">
        <strong>💡 Hướng dẫn:</strong>
        <ul className="mb-0 mt-1">
          <li>Kéo thả các phần tử (hình ảnh/text) trên canvas</li>
          <li>Xem tọa độ real-time ở bảng trên</li>
          <li>Mở Console (F12) để xem log chi tiết khi thả phần tử</li>
          <li>Copy JSON config từ console để dùng trong template</li>
        </ul>
      </div>
    </div>
  );
};

export default DesignCanvas;
