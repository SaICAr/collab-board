"use client";

import { boundingBox } from "@/lib/utils";
import { ImageLayer } from "@/types/canvas";
import { useMemo } from "react";

interface ImageProps {
  id: string;
  layer: ImageLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

export const Image = ({ id, layer, onPointerDown, selectionColor }: ImageProps) => {
  const { x, y, width, height, value } = layer;

  const bounds = useMemo(() => boundingBox([layer]), [layer]);

  return (
    <>
      {selectionColor && (
        <rect
          className="fill-transparent pointer-events-none"
          style={{ transform: `translate(${bounds?.x}px, ${bounds?.y}px)` }}
          x={0}
          y={0}
          width={bounds?.width}
          height={bounds?.height}
          stroke={selectionColor || "transparent"}
          strokeWidth={1}
        />
      )}

      <image
        className="drop-shadow-md"
        href={value}
        onPointerDown={(e) => onPointerDown(e, id)}
        // 开启GPU加速
        style={{ transform: `translate(${x}px, ${y}px)` }}
        x={0}
        y={0}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
      />
    </>
  );
};
