import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance, { BASE_URL } from "../api/axiosInstance.jsx";
import DesignCanvas from "../components/DesignCanvas.jsx";

const ProductDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState({
    product: null,
    design: null,
    loading: true,
  });
  const [selections, setSelections] = useState({});
  const [quantity, setQuantity] = useState(1);

  const formatImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return url.startsWith("/uploads")
      ? `${BASE_URL}${url}`
      : `${BASE_URL}/uploads/products/${url}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pRes = await axiosInstance.get(`/products/${id}`);
        const product = pRes.data.data;
        const vId = product.variants[0]?.variant_id;

        const dRes = await axiosInstance.get(`/design/variant/${vId}`);
        const design = dRes.data.data[0];

        setData({ product, design, loading: false });
      } catch (err) {
        console.error(err);
        setData((prev) => ({ ...prev, loading: false }));
      }
    };
    fetchData();
  }, [id]);

  if (data.loading) return <div className="text-center mt-5">Đang tải...</div>;
  const { product, design } = data;

  // Lấy ảnh variant đầu tiên để làm mockup nền
  const variantMainImage = formatImageUrl(product?.images[0]?.url);

  return (
    <div className="container mt-4">
      <div className="row">
        {/* TRÁI: CANVAS THIẾT KẾ */}
        <div className="col-md-7">
          <DesignCanvas
            designData={design?.design_json}
            userSelections={selections}
            // Truyền ảnh đã được format đầy đủ endpoint localhost:3000
            variantImage={variantMainImage}
          />
        </div>

        {/* PHẢI: ĐIỀU KHIỂN */}
        <div className="col-md-5">
          <h2 className="fw-bold">{product?.name}</h2>
          <h4 className="text-danger mb-4">
            {Number(product?.variants[0]?.sale_price || 0).toLocaleString()}đ
          </h4>

          <div className="p-3 border rounded bg-light shadow-sm">
            <h6 className="fw-bold mb-3 border-bottom pb-2 text-uppercase">
              Tùy chỉnh thiết kế
            </h6>
            {design?.design_json
              ?.find((s) => s.type === "F")
              ?.detail.map((layer) => (
                <div key={layer.layer} className="mb-3">
                  <label className="small fw-bold text-muted text-uppercase">
                    {layer.label}
                  </label>
                  <div className="d-flex gap-2 flex-wrap mt-1">
                    {/* Option hình ảnh (Nhân vật, biểu tượng...) */}
                    {layer.type === "image_option" &&
                      layer.options.map((opt) => (
                        <img
                          key={opt.id}
                          src={formatImageUrl(opt.image_url)} // Format endpoint tại đây
                          alt={opt.name}
                          className={`border rounded p-1 bg-white ${
                            selections[layer.layer] === opt.id
                              ? "border-primary border-3"
                              : ""
                          }`}
                          style={{
                            width: "55px",
                            height: "55px",
                            cursor: "pointer",
                            objectFit: "contain",
                          }}
                          onClick={() =>
                            setSelections({
                              ...selections,
                              [layer.layer]: opt.id,
                            })
                          }
                        />
                      ))}

                    {/* Option màu sắc */}
                    {layer.type === "color_option" &&
                      layer.options.map((opt) => (
                        <div
                          key={opt.id}
                          onClick={() =>
                            setSelections({
                              ...selections,
                              [layer.layer]: opt.id,
                            })
                          }
                          className={`border rounded-circle ${
                            selections[layer.layer] === opt.id
                              ? "border-dark border-3 shadow-sm"
                              : ""
                          }`}
                          style={{
                            width: "35px",
                            height: "35px",
                            backgroundColor: opt.color,
                            cursor: "pointer",
                          }}
                          title={opt.name}
                        />
                      ))}

                    {/* Option văn bản */}
                    {layer.type === "text" && (
                      <input
                        type="text"
                        className="form-control form-control-sm border-secondary"
                        placeholder="Nhập nội dung..."
                        onChange={(e) =>
                          setSelections({
                            ...selections,
                            [layer.layer]: e.target.value,
                          })
                        }
                      />
                    )}
                  </div>
                </div>
              ))}
          </div>

          <div className="d-flex gap-2 mt-4">
            <input
              type="number"
              className="form-control w-25 text-center fw-bold"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
            />
            <button className="btn btn-dark flex-grow-1 fw-bold">
              THÊM VÀO GIỎ HÀNG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
