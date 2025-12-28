import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import MugProduct from "../components/MugProduct";
import ShirtProduct from "../components/ShirtProduct";

const ProductDetail = () => {
  const { id } = useParams();
  const stageRef = useRef(null);
  const [product, setProduct] = useState(null);
  const [personalization, setPersonalization] = useState({});
  // Thêm state để theo dõi tab đang mở
  const [isDesignMode, setIsDesignMode] = useState(false);

  useEffect(() => {
    axiosInstance.get(`/products/${id}`).then((res) => {
      const p = res.data.data;
      setProduct(p);

      if (p.template_type === "mug") {
        setPersonalization({ userName: "Tên của bạn", selectedDesignId: "d1" });
      } else {
        setPersonalization({
          characterId: null,
          shirtColorId: "white",
          shirtText: "",
          textColor: "#000000",
          textSize: 28,
          imagePos: { x: 175, y: 150 },
          imageSize: { width: 150, height: 150 },
          textPos: { x: 175, y: 420 },
        });
      }
    });
  }, [id]);

  const handleAddToCart = async () => {
    let previewUrl = null;
    let customJson = null;

    // Chỉ yêu cầu Stage nếu sản phẩm có thiết kế VÀ người dùng đang ở tab thiết kế
    const shouldCaptureCanvas =
      (product.template_type === "tshirt_animal" ||
        product.template_type === "mug") &&
      isDesignMode;

    if (shouldCaptureCanvas) {
      if (!stageRef.current) {
        alert("Vui lòng đợi hệ thống thiết kế tải xong.");
        return;
      }
      previewUrl = stageRef.current.toDataURL({
        mimeType: "image/jpeg",
        quality: 0.7,
      });
      customJson = personalization;
    }

    try {
      const payload = {
        product_id: product.product_id,
        quantity: 1,
        customization_json: customJson,
        preview_image_url: previewUrl,
      };

      const response = await axiosInstance.post("/cart/add", payload);
      alert(response.data.message || "Đã thêm vào giỏ hàng!");
    } catch (err) {
      console.error("Lỗi:", err);
      alert("Không thể thêm vào giỏ hàng.");
    }
  };

  if (!product)
    return (
      <div className="container mt-5 text-center">Đang tải sản phẩm...</div>
    );

  const commonProps = {
    product,
    data: personalization,
    setData: setPersonalization,
    stageRef,
    onAddToCart: handleAddToCart,
    setIsDesignMode, // Truyền hàm này xuống
  };

  return (
    <>
      {product.template_type === "mug" ? (
        <MugProduct {...commonProps} />
      ) : (
        <ShirtProduct {...commonProps} />
      )}
    </>
  );
};

export default ProductDetail;
