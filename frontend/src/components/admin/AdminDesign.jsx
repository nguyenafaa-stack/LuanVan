import React, { useState, useRef, useEffect } from "react";
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Text as KonvaText,
  Transformer,
} from "react-konva";
import useImage from "use-image";
import axiosInstance from "../../api/axiosInstance";

// Component hỗ trợ render ảnh nền Mockup
const URLImage = ({ src, ...props }) => {
  const [img] = useImage(src, "Anonymous");
  return <KonvaImage image={img} {...props} />;
};

// Component Layer ảnh có thể chỉnh sửa
const EditableImage = ({ shapeProps, isSelected, onSelect, onChange }) => {
  const [img] = useImage(shapeProps.src, "Anonymous");
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <KonvaImage
        image={img}
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
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
            height: Math.max(5, node.height() * scaleY),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) =>
            newBox.width < 5 || newBox.height < 5 ? oldBox : newBox
          }
        />
      )}
    </>
  );
};

const AdminDesign = () => {
  const [name, setName] = useState("");
  const [mockupUrl, setMockupUrl] = useState(""); // URL ảnh mockup sau khi upload
  const [layers, setLayers] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Format URL để hiển thị ảnh trên Canvas
  const getFullUrl = (url) => {
    if (!url) return "https://via.placeholder.com/500?text=Upload+Mockup+First";
    return url.startsWith("http") ? url : `http://localhost:3000${url}`;
  };

  // Hàm xử lý upload ảnh (Dùng chung cho cả Mockup và Layer Option)
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await axiosInstance.post("/upload/design-option", formData);
    return res.data.url;
  };

  // Upload Mockup nền
  const handleMockupUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setLoading(true);
      const url = await uploadImage(file);
      setMockupUrl(url);
    } catch (err) {
      alert("Lỗi upload mockup!");
    } finally {
      setLoading(false);
    }
  };

  // Thêm Layer mới
  const addLayer = (type) => {
    const id = `layer_${Date.now()}`;
    const newLayer = {
      id,
      type,
      x: 150,
      y: 150,
      zIndex: layers.length + 1,
      label: type === "text" ? "Slogan mới" : "Layer ảnh mới",
      options: [],
    };

    if (type === "text") {
      newLayer.text = "Designer Name";
      newLayer.fontSize = 24;
      newLayer.fill = "#000000";
    } else {
      newLayer.src = "https://via.placeholder.com/100?text=IMAGE";
      newLayer.width = 100;
      newLayer.height = 100;
    }
    setLayers([...layers, newLayer]);
    setSelectedId(id);
  };

  // Upload ảnh cho từng Layer Option
  const handleLayerImageUpload = async (e, layerId) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const url = await uploadImage(file);
      setLayers(
        layers.map((l) =>
          l.id === layerId
            ? {
                ...l,
                src: getFullUrl(url),
                options: [
                  { id: `opt_${Date.now()}`, name: file.name, image_url: url },
                ],
              }
            : l
        )
      );
    } catch (err) {
      alert("Lỗi upload ảnh layer!");
    }
  };

  const handleSave = async () => {
    if (!name || !mockupUrl || layers.length === 0)
      return alert("Vui lòng nhập tên, tải mockup và thêm ít nhất 1 layer");

    setLoading(true);
    const design_json = [
      {
        type: "F",
        detail: layers.map((l) => ({
          layer: l.id,
          type: l.type === "text" ? "text" : "image_option",
          label: l.label,
          zIndex: l.zIndex,
          options: l.options,
          default_config: { ...l, draggable: true },
        })),
      },
    ];

    try {
      await axiosInstance.post("/designs", {
        name,
        thumbnail_url: mockupUrl,
        design_json,
      });
      alert("Lưu template thành công!");
    } catch (err) {
      alert("Lỗi khi lưu vào database!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        {/* TRÁI: REVIEW CANVAS */}
        <div
          className="col-md-8 text-center bg-dark rounded p-4"
          style={{ minHeight: "650px" }}
        >
          <h5 className="text-white mb-3">Khu vực thiết kế (500x500)</h5>
          <div className="d-inline-block border bg-white shadow">
            <Stage width={500} height={500} onClick={() => setSelectedId(null)}>
              <Layer>
                <URLImage
                  src={getFullUrl(mockupUrl)}
                  width={500}
                  height={500}
                />
                {layers.map((l, i) =>
                  l.type === "text" ? (
                    <KonvaText
                      key={l.id}
                      {...l}
                      draggable
                      onClick={(e) => {
                        e.cancelBubble = true;
                        setSelectedId(l.id);
                      }}
                      onDragEnd={(e) => {
                        const newLayers = [...layers];
                        newLayers[i] = {
                          ...l,
                          x: e.target.x(),
                          y: e.target.y(),
                        };
                        setLayers(newLayers);
                      }}
                    />
                  ) : (
                    <EditableImage
                      key={l.id}
                      shapeProps={l}
                      isSelected={l.id === selectedId}
                      onSelect={() => setSelectedId(l.id)}
                      onChange={(newAttrs) => {
                        const newLayers = [...layers];
                        newLayers[i] = newAttrs;
                        setLayers(newLayers);
                      }}
                    />
                  )
                )}
              </Layer>
            </Stage>
          </div>
        </div>

        {/* PHẢI: CẤU HÌNH */}
        <div className="col-md-4">
          <div
            className="card shadow-sm p-3 sticky-top"
            style={{ top: "20px" }}
          >
            <h6 className="fw-bold border-bottom pb-2">Thông tin chung</h6>

            <label className="small fw-bold mt-2">Tên Template:</label>
            <input
              type="text"
              className="form-control mb-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label className="small fw-bold">Tải ảnh Mockup (Nền):</label>
            <input
              type="file"
              className="form-control mb-3"
              accept="image/*"
              onChange={handleMockupUpload}
            />

            <div className="d-flex gap-2 mb-3">
              <button
                className="btn btn-primary btn-sm flex-grow-1"
                onClick={() => addLayer("image_option")}
              >
                + Thêm Ảnh
              </button>
              <button
                className="btn btn-secondary btn-sm flex-grow-1"
                onClick={() => addLayer("text")}
              >
                + Thêm Chữ
              </button>
            </div>

            <div
              className="layer-list mt-2"
              style={{ maxHeight: "350px", overflowY: "auto" }}
            >
              <p className="fw-bold small mb-2 text-muted">DANH SÁCH LAYERS:</p>
              {layers.map((l) => (
                <div
                  key={l.id}
                  className={`p-2 mb-2 border rounded ${
                    selectedId === l.id ? "bg-light border-primary" : ""
                  }`}
                >
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="badge bg-secondary">{l.type}</span>
                    <button
                      className="btn btn-sm text-danger p-0"
                      onClick={() =>
                        setLayers(layers.filter((x) => x.id !== l.id))
                      }
                    >
                      Xóa
                    </button>
                  </div>
                  <input
                    type="text"
                    className="form-control form-control-sm mb-2"
                    value={l.label}
                    onChange={(e) =>
                      setLayers(
                        layers.map((x) =>
                          x.id === l.id ? { ...x, label: e.target.value } : x
                        )
                      )
                    }
                  />

                  {l.type === "image_option" && (
                    <input
                      type="file"
                      className="form-control form-control-sm"
                      accept="image/*"
                      onChange={(e) => handleLayerImageUpload(e, l.id)}
                    />
                  )}
                </div>
              ))}
            </div>

            <button
              className="btn btn-success w-100 fw-bold mt-3"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "ĐANG XỬ LÝ..." : "LƯU TEMPLATE"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDesign;
