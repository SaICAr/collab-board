"use client";

import { EllipseLayer } from "@/types/canvas";
import { DEFAULT_COLOR } from "../canvas";

interface EllipseProps {
  id: string;
  layer: EllipseLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

export const Ellipse = ({ id, layer, onPointerDown, selectionColor }: EllipseProps) => {
  const { x, y, width, height, fill, transform } = layer;

  return (
    <ellipse
      className="drop-shadow-md"
      onPointerDown={(e) => onPointerDown(e, id)}
      // 开启GPU加速
      style={{ transform: `matrix(${transform})` }}
      cx={width / 2}
      cy={height / 2}
      rx={width / 2}
      ry={height / 2}
      fill={fill ?? DEFAULT_COLOR}
      stroke={selectionColor || "transparent"}
      strokeWidth={1}
    />
  );
};
