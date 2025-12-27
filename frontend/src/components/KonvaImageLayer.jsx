import React from "react";
import { Image as KonvaImage, Group } from "react-konva";
import useImage from "use-image";

const KonvaImageLayer = ({ url, x, y, width, height, opacity = 1 }) => {
  const [image] = useImage(url, "anonymous");

  if (!image) return <Group />;

  return (
    <KonvaImage
      image={image}
      x={x}
      y={y}
      width={width}
      height={height}
      opacity={opacity}
    />
  );
};

export default KonvaImageLayer;
