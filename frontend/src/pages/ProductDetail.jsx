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
  useEffect(() => {
    axiosInstance.get(`/products/${id}`).then((res) => {
      const p = res.data.data;
      setProduct(p);

      if (p.template_type === "mug") {
        setPersonalization({
          userName: "Tên của bạn",
          selectedDesignId: "d1",
        });
      } else {
        setPersonalization({
          characterId: null,
          shirtColorId: "white",
          shirtText: "",
          imagePos: { x: 175, y: 150 },
          imageSize: { width: 150, height: 150 },
          textPos: { x: 175, y: 420 },
        });
      }
    });
  }, [id]);

  const handleAddToCart = async () => {
    if (!stageRef.current) {
      alert("Vui lòng đợi hệ thống thiết kế tải xong.");
      return;
    }

    try {
      const previewUrl = stageRef.current.toDataURL({
        pixelRatio: 2,
        mimeType: "image/jpeg", // Chuyển sang jpeg để giảm dung lượng payload
        quality: 0.8,
      });

      const payload = {
        product_id: product.product_id,
        quantity: 1,
        customization_json: personalization,
        preview_image_url: previewUrl,
      };

      // console.log("Payload gửi đi:", payload);

      const response = await axiosInstance.post("/cart/add", payload);
      alert(response.data.message || "Đã thêm thiết kế vào giỏ hàng!");
    } catch (err) {
      console.error("Lỗi thêm giỏ hàng:", err);
      // Kiểm tra lỗi 413 (Payload Too Large) tại đây
      if (err.response?.status === 413) {
        alert("Dữ liệu thiết kế quá lớn, vui lòng giảm chất lượng ảnh.");
      } else {
        alert(err.response?.data?.message || "Không thể thêm vào giỏ hàng.");
      }
    }
  };

  if (!product)
    return (
      <div className="container mt-5 text-center">Đang tải sản phẩm...</div>
    );

  return (
    <>
      {product.template_type === "mug" ? (
        <MugProduct
          product={product}
          data={personalization}
          setData={setPersonalization}
          stageRef={stageRef}
          onAddToCart={handleAddToCart}
        />
      ) : (
        <ShirtProduct
          product={product}
          data={personalization}
          setData={setPersonalization}
          stageRef={stageRef}
          onAddToCart={handleAddToCart}
        />
      )}
    </>
  );
};

export default ProductDetail;
