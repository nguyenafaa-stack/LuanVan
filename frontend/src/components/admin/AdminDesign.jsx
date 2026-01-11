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

// --- COMPONENT HỖ TRỢ LOAD ẢNH ---
const URLImage = ({ src, ...props }) => {
  const [img] = useImage(src, "Anonymous");
  return <KonvaImage image={img} {...props} />;
};

// --- COMPONENT LAYER CÓ THỂ CHỈNH SỬA ---
const EditableLayer = ({ shapeProps, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef();
  const trRef = useRef();
  const { zIndex, ...pureProps } = shapeProps;
  const isText = pureProps.type === "text";
  const isUploadArea = pureProps.type === "upload";

  // Placeholder cho vùng upload để Admin dễ nhìn
  const imageSrc =
    isUploadArea && !pureProps.src
      ? "https://via.placeholder.com/150?text=VUNG+UPLOAD"
      : pureProps.src;

  const [img, status] = useImage(isText ? null : imageSrc, "Anonymous");

  useEffect(() => {
    if (isSelected && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected, status]);

  const commonHandlers = {
    onClick: onSelect,
    onTap: onSelect,
    onDragEnd: (e) => {
      onChange({ ...shapeProps, x: e.target.x(), y: e.target.y() });
    },
    onTransformEnd: () => {
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
    },
  };

  return (
    <>
      {isText ? (
        <KonvaText
          ref={shapeRef}
          {...pureProps}
          draggable
          {...commonHandlers}
        />
      ) : (
        (status === "loaded" || isUploadArea) && (
          <KonvaImage
            ref={shapeRef}
            image={img}
            {...pureProps}
            opacity={isUploadArea ? 0.6 : 1}
            draggable
            {...commonHandlers}
          />
        )
      )}
      {isSelected && (isText || status === "loaded") && (
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
  const [mockupUrl, setMockupUrl] = useState("");
  const [layers, setLayers] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);

  const getFullUrl = (url) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `http://localhost:3000${url}`;
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await axiosInstance.post("/design/upload-temp", formData);
    return res.data.url;
  };

  const addLayer = (type) => {
    const id = `layer_${Date.now()}`;
    const newLayer = {
      id,
      type,
      x: 150,
      y: 150,
      zIndex: layers.length + 1,
      label:
        type === "text"
          ? "Nhập slogan"
          : type === "upload"
          ? "Vùng upload"
          : "Chọn nhân vật",
    };

    if (type === "text") {
      newLayer.text = "Designer Name";
      newLayer.fontSize = 20;
      newLayer.fill = "#000000";
      newLayer.fontFamily = "Arial";
      newLayer.align = "center";
    } else {
      newLayer.src =
        type === "upload" ? "" : "https://via.placeholder.com/100?text=IMAGE";
      newLayer.width = 100;
      newLayer.height = 100;
      newLayer.options = [];
    }
    setLayers([...layers, newLayer]);
    setSelectedId(id);
  };

  const handleAddOption = async (e, layerId) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newOptions = await Promise.all(
      files.map(async (file) => {
        const url = await uploadFile(file);
        return {
          id: `opt_${Date.now()}_${Math.random()}`,
          name: file.name.split(".")[0],
          image_url: url,
        };
      })
    );

    setLayers(
      layers.map((l) => {
        if (l.id === layerId) {
          return {
            ...l,
            src: getFullUrl(newOptions[0].image_url), // Hiển thị ảnh đầu tiên làm preview
            options: [...(l.options || []), ...newOptions],
          };
        }
        return l;
      })
    );
  };
  const handleSave = async () => {
    if (!name || !mockupUrl) return alert("Vui lòng nhập tên và tải Mockup");
    setLoading(true);

    const detail = layers.map((l) => ({
      layer: l.id,
      type: l.type,
      label: l.label,
      zIndex: l.zIndex,
      options: l.options || [],
      default_config: { ...l, draggable: true },
    }));

    const design_json = [
      {
        type: "F",
        detail: detail,
      },
    ];

    try {
      await axiosInstance.post("/design/create", {
        name,
        thumbnail_url: mockupUrl,
        design_json,
      });
      alert("Lưu Template thành công!");
    } catch (err) {
      alert("Lỗi lưu database!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-md-8 bg-dark rounded p-4 text-center">
          <div className="d-inline-block bg-white shadow-lg border overflow-hidden rounded">
            <Stage width={500} height={500} onClick={() => setSelectedId(null)}>
              <Layer>
                {mockupUrl && (
                  <URLImage
                    src={getFullUrl(mockupUrl)}
                    width={500}
                    height={500}
                  />
                )}
                {[...layers]
                  .sort((a, b) => a.zIndex - b.zIndex)
                  .map((l) => (
                    <EditableLayer
                      key={l.id}
                      shapeProps={l}
                      isSelected={l.id === selectedId}
                      onSelect={(e) => {
                        e.cancelBubble = true;
                        setSelectedId(l.id);
                      }}
                      onChange={(newAttrs) =>
                        setLayers(
                          layers.map((item) =>
                            item.id === l.id
                              ? { ...newAttrs, zIndex: l.zIndex }
                              : item
                          )
                        )
                      }
                    />
                  ))}
              </Layer>
            </Stage>
          </div>
        </div>

        <div
          className="col-md-4 sticky-top"
          style={{ height: "90vh", overflowY: "auto" }}
        >
          <div className="card p-3 shadow-sm border-0">
            <h5 className="fw-bold border-bottom pb-2">Cấu hình Template</h5>
            <div className="mb-3 mt-2">
              <label className="small fw-bold">Tên mẫu:</label>
              <input
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="small fw-bold text-success">
                1. Tải Mockup Nền:
              </label>
              <input
                type="file"
                className="form-control"
                onChange={async (e) =>
                  setMockupUrl(await uploadFile(e.target.files[0]))
                }
              />
            </div>

            <div className="btn-group w-100 mb-3 shadow-sm">
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => addLayer("image_option")}
              >
                + Image Opt
              </button>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => addLayer("text")}
              >
                + Text
              </button>
              {/* <button
                className="btn btn-outline-info btn-sm text-white"
                onClick={() => addLayer("upload")}
              >
                + Upload
              </button> */}
            </div>

            <div className="layers-list border-top pt-2">
              {layers.map((l) => (
                <div
                  key={l.id}
                  className={`p-2 mb-2 border rounded ${
                    selectedId === l.id ? "bg-light border-primary" : ""
                  }`}
                >
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="badge bg-dark">
                      {l.type.toUpperCase()}
                    </span>
                    <button
                      className="btn btn-sm text-danger p-0 border-0"
                      onClick={() =>
                        setLayers(layers.filter((i) => i.id !== l.id))
                      }
                    >
                      Xóa
                    </button>
                  </div>
                  <input
                    className="form-control form-control-sm mb-2"
                    value={l.label}
                    onChange={(e) =>
                      setLayers(
                        layers.map((i) =>
                          i.id === l.id ? { ...i, label: e.target.value } : i
                        )
                      )
                    }
                  />

                  {l.type === "image_option" && (
                    <>
                      <label className="x-small fw-bold">
                        Tải lên nhiều ảnh (Options):
                      </label>
                      <input
                        type="file"
                        className="form-control form-control-sm mb-2"
                        multiple
                        onChange={(e) => handleAddOption(e, l.id)}
                      />
                      <div className="d-flex gap-1 flex-wrap">
                        {l.options?.map((opt) => (
                          <img
                            key={opt.id}
                            src={getFullUrl(opt.image_url)}
                            style={{
                              width: 30,
                              height: 30,
                              objectFit: "cover",
                            }}
                            className="border"
                          />
                        ))}
                      </div>
                    </>
                  )}
                  {l.type === "text" && (
                    <input
                      className="form-control form-control-sm"
                      value={l.text}
                      onChange={(e) =>
                        setLayers(
                          layers.map((i) =>
                            i.id === l.id ? { ...i, text: e.target.value } : i
                          )
                        )
                      }
                    />
                  )}
                </div>
              ))}
            </div>
            <button
              className="btn btn-primary w-100 fw-bold mt-4 py-2"
              onClick={handleSave}
              disabled={loading}
            >
              LƯU TEMPLATE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDesign;
