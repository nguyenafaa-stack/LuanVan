import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import DesignCanvas from "../components/DesignCanvas";

// ============== CUSTOM HOOKS ==============

// Hook quản lý dữ liệu sản phẩm
const useProduct = (productId) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get(`/products/${productId}`)
      .then((res) => {
        setProduct(res.data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [productId]);

  return { product, loading };
};

// Hook quản lý variants và attributes
const useProductVariant = (product) => {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedAttributes, setSelectedAttributes] = useState({});

  // Thiết lập variant mặc định khi load sản phẩm
  useEffect(() => {
    if (product?.variants?.length > 0) {
      const firstVariant = product.variants[0];
      setSelectedVariant(firstVariant);
      setSelectedAttributes(firstVariant.attributes);
    }
  }, [product]);

  // Cập nhật variant khi attributes thay đổi
  useEffect(() => {
    if (product?.variants) {
      const matchedVariant = product.variants.find(
        (v) =>
          JSON.stringify(v.attributes) === JSON.stringify(selectedAttributes)
      );
      if (matchedVariant) {
        setSelectedVariant(matchedVariant);
      }
    }
  }, [selectedAttributes, product]);

  const handleAttributeChange = (key, value) => {
    setSelectedAttributes((prev) => ({ ...prev, [key]: value }));
  };

  return {
    selectedVariant,
    selectedAttributes,
    handleAttributeChange,
  };
};

// Hook quản lý designs
const useDesigns = (variantId) => {
  const [designs, setDesigns] = useState([]);

  useEffect(() => {
    if (variantId) {
      axiosInstance.get(`/design/variant/${variantId}`).then((res) => {
        const processedDesigns = (res.data.data || []).map((d) => ({
          ...d,
          design_json:
            typeof d.design_json === "string"
              ? JSON.parse(d.design_json)
              : d.design_json,
        }));
        setDesigns(processedDesigns);
      });
    }
  }, [variantId]);

  return designs;
};

// Hook quản lý customization
const useCustomization = (designs) => {
  const [userSelections, setUserSelections] = useState({});
  const [isCustomizing, setIsCustomizing] = useState(false);

  // Reset customization khi designs thay đổi
  useEffect(() => {
    setUserSelections({});
    setIsCustomizing(false);
  }, [designs]);

  const handleDesignChange = (layerName, value) => {
    setIsCustomizing(true);
    setUserSelections((prev) => ({
      ...prev,
      [layerName]: value,
    }));
  };

  const resetCustomization = () => {
    setIsCustomizing(false);
    setUserSelections({});
  };

  return {
    userSelections,
    isCustomizing,
    handleDesignChange,
    resetCustomization,
  };
};

// ============== UTILITY FUNCTIONS ==============

const formatImageUrl = (url) => {
  return url?.startsWith("http")
    ? url
    : `http://localhost:3000/uploads/products/shirts/${url}`;
};

const getDefaultImage = (product) => {
  if (!product?.images?.length) return "";
  const defaultImg =
    product.images.find(
      (img) => img.is_main === 1 && img.image_type === "product"
    ) || product.images[0];
  return formatImageUrl(defaultImg.url);
};

const getVariantImage = (product, variantId) => {
  const variantImg = product?.images?.find(
    (img) => img.imageable_id === variantId && img.image_type === "variant"
  );
  return variantImg ? formatImageUrl(variantImg.url) : null;
};

// ============== SUB COMPONENTS ==============

// Component hiển thị ảnh sản phẩm
const ProductImageGallery = ({ product, mainImage, onImageClick }) => {
  return (
    <div className="text-center">
      <img
        src={mainImage}
        alt={product.name}
        className="img-fluid border rounded p-3 bg-white"
        style={{
          maxHeight: "500px",
          objectFit: "contain",
          width: "100%",
        }}
      />
      <div className="d-flex gap-2 mt-3 overflow-auto">
        {product.images
          ?.filter((img) => img.image_type === "product")
          .map((img, i) => (
            <img
              key={i}
              src={formatImageUrl(img.url)}
              className="img-thumbnail"
              style={{ width: "70px", height: "70px", cursor: "pointer" }}
              onClick={() => onImageClick(formatImageUrl(img.url))}
            />
          ))}
      </div>
    </div>
  );
};

// Component chọn attributes (size, màu)
const AttributeSelector = ({
  attributes,
  selectedAttributes,
  onAttributeChange,
}) => {
  return (
    <>
      {Object.entries(attributes).map(([key, values]) => (
        <div key={key} className="mb-3">
          <label className="fw-bold small mb-1">{key.toUpperCase()}</label>
          <div className="d-flex gap-2">
            {values.map((val) => (
              <button
                key={val}
                className={`btn btn-sm ${
                  selectedAttributes[key] === val
                    ? "btn-dark"
                    : "btn-outline-dark"
                }`}
                onClick={() => onAttributeChange(key, val)}
              >
                {val}
              </button>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

// Component panel tùy chỉnh thiết kế
const DesignCustomizationPanel = ({
  design,
  userSelections,
  onDesignChange,
  onReset,
  isCustomizing,
}) => {
  if (!design?.design_json) return null;

  const detailLayers =
    design.design_json.find((side) => side.type === "F")?.detail || [];

  return (
    <div className="mt-4 p-3 border rounded bg-light shadow-sm">
      <h6 className="fw-bold border-bottom pb-2 mb-3">TÙY CHỈNH THIẾT KẾ</h6>
      {detailLayers.map((layer) => (
        <div key={layer.layer} className="mb-3">
          <label className="small fw-bold text-uppercase text-muted">
            {layer.label}
          </label>
          <div className="d-flex gap-2 flex-wrap mt-1">
            {/* Render hình ảnh */}
            {layer.type === "image_option" &&
              layer.options?.map((opt) => (
                <img
                  key={opt.id}
                  src={formatImageUrl(opt.image_url)}
                  alt={opt.name}
                  title={opt.name}
                  className={`border rounded p-1 bg-white ${
                    userSelections[layer.layer] === opt.id
                      ? "border-primary border-3 shadow-sm"
                      : "border-secondary"
                  }`}
                  style={{
                    width: "55px",
                    height: "55px",
                    cursor: "pointer",
                    objectFit: "contain",
                  }}
                  onClick={() => onDesignChange(layer.layer, opt.id)}
                />
              ))}

            {/* Render chọn màu */}
            {layer.type === "color_option" &&
              layer.options?.map((opt) => (
                <div
                  key={opt.id}
                  title={opt.name}
                  className={`border rounded ${
                    userSelections[layer.layer] === opt.id
                      ? "border-primary border-3 shadow-sm"
                      : "border-secondary"
                  }`}
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: opt.color,
                    cursor: "pointer",
                    boxShadow:
                      opt.color === "#FFFFFF" ? "inset 0 0 0 1px #ddd" : "none",
                  }}
                  onClick={() => onDesignChange(layer.layer, opt.id)}
                />
              ))}

            {/* Render text input */}
            {layer.type === "text" && (
              <input
                type="text"
                className="form-control form-control-sm border-secondary"
                placeholder={`Nhập ${layer.label.toLowerCase()}...`}
                value={userSelections[layer.layer] || ""}
                onChange={(e) => onDesignChange(layer.layer, e.target.value)}
              />
            )}
          </div>
        </div>
      ))}

      {isCustomizing && (
        <div className="text-end mt-2">
          <button
            className="btn btn-sm text-danger p-0"
            style={{ fontSize: "0.8rem", textDecoration: "none" }}
            onClick={onReset}
          >
            <i className="bi bi-arrow-counterclockwise"></i> Xóa tùy chỉnh, dùng
            ảnh gốc
          </button>
        </div>
      )}
    </div>
  );
};

// Component số lượng và nút thêm giỏ hàng
const AddToCartSection = ({
  quantity,
  onQuantityChange,
  onAddToCart,
  disabled,
  isCustomizing,
}) => {
  return (
    <div className="d-flex gap-3 mt-4">
      <div className="input-group" style={{ width: "120px" }}>
        <button
          className="btn btn-outline-dark"
          onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
        >
          -
        </button>
        <input
          type="text"
          className="form-control text-center"
          value={quantity}
          readOnly
        />
        <button
          className="btn btn-outline-dark"
          onClick={() => onQuantityChange(quantity + 1)}
        >
          +
        </button>
      </div>
      <button
        className="btn btn-dark flex-grow-1 fw-bold"
        disabled={disabled}
        onClick={onAddToCart}
      >
        {isCustomizing ? "THÊM VÀO GIỎ (CÓ THIẾT KẾ)" : "THÊM VÀO GIỎ HÀNG"}
      </button>
    </div>
  );
};

// ============== MAIN COMPONENT ==============

const ProductDetail = () => {
  const { id } = useParams();
  const { product, loading } = useProduct(id);
  const { selectedVariant, selectedAttributes, handleAttributeChange } =
    useProductVariant(product);
  const designs = useDesigns(selectedVariant?.variant_id);
  const {
    userSelections,
    isCustomizing,
    handleDesignChange,
    resetCustomization,
  } = useCustomization(designs);

  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Cập nhật ảnh chính khi sản phẩm load hoặc variant thay đổi
  useEffect(() => {
    if (product) {
      const variantImg = getVariantImage(product, selectedVariant?.variant_id);
      setMainImage(variantImg || getDefaultImage(product));
    }
  }, [product, selectedVariant]);

  const handleImageClick = (imageUrl) => {
    setMainImage(imageUrl);
    resetCustomization();
  };

  const handleAddToCart = () => {
    const payload = {
      variant_id: selectedVariant.variant_id,
      quantity: quantity,
      design_json: isCustomizing ? userSelections : null,
    };
    console.log("Adding to cart:", payload);
    // axiosInstance.post('/cart/add', payload)...
  };

  if (loading) return <div className="text-center mt-5">Đang tải...</div>;
  if (!product)
    return <div className="text-center mt-5">Không tìm thấy sản phẩm</div>;

  return (
    <div className="container mt-5">
      <div className="row">
        {/* CỘT TRÁI: HIỂN THỊ */}
        <div className="col-md-6">
          {isCustomizing && designs.length > 0 ? (
            <DesignCanvas
              designData={designs[0].design_json}
              userSelections={userSelections}
              variantImage={mainImage} // Truyền thêm prop này
            />
          ) : (
            <ProductImageGallery
              product={product}
              mainImage={mainImage}
              onImageClick={handleImageClick}
            />
          )}
        </div>

        {/* CỘT PHẢI: ĐIỀU KHIỂN */}
        <div className="col-md-6 ps-md-5">
          <h1 className="fw-bold">{product.name}</h1>
          <h3 className="text-danger my-3">
            {selectedVariant
              ? `${Number(
                  selectedVariant.sale_price || selectedVariant.base_price
                ).toLocaleString()}đ`
              : "---"}
          </h3>

          <AttributeSelector
            attributes={product.product_attributes}
            selectedAttributes={selectedAttributes}
            onAttributeChange={handleAttributeChange}
          />

          <DesignCustomizationPanel
            design={designs[0]}
            userSelections={userSelections}
            onDesignChange={handleDesignChange}
            onReset={resetCustomization}
            isCustomizing={isCustomizing}
          />

          <AddToCartSection
            quantity={quantity}
            onQuantityChange={setQuantity}
            onAddToCart={handleAddToCart}
            disabled={!selectedVariant || selectedVariant.stock_quantity <= 0}
            isCustomizing={isCustomizing}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
