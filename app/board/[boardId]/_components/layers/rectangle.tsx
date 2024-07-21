"use client";

import { RectangleLayer } from "@/types/canvas";
import { DEFAULT_COLOR } from "../canvas";

interface RectangleProps {
  id: string;
  layer: RectangleLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

export const Rectangle = ({ id, layer, onPointerDown, selectionColor }: RectangleProps) => {
  const { width, height, fill, transform } = layer;

  return (
    <rect
      className="drop-shadow-md"
      onPointerDown={(e) => onPointerDown(e, id)}
      // 开启GPU加速
      style={{ transform: `matrix(${transform})` }}
      x={0}
      y={0}
      width={width}
      height={height}
      fill={fill ?? DEFAULT_COLOR}
      stroke={selectionColor || "transparent"}
      strokeWidth={1}
    />
  );
};
