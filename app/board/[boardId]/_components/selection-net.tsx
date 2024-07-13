"use client";

import { memo } from "react";

import { CanvasMode, CanvasState } from "@/types/canvas";
import { INSERT_LAYER_THRESHOLD } from "./canvas";

interface SelectionNetProps {
  canvasState: CanvasState;
}

export const SelectionNet = memo(({ canvasState }: SelectionNetProps) => {
  if (
    (canvasState.mode !== CanvasMode.SelectionNet && canvasState.mode !== CanvasMode.Inserting) ||
    !canvasState.origin ||
    !canvasState.current
  ) {
    return null;
  }

  let x = Math.min(canvasState.origin.x, canvasState.current.x);
  let y = Math.min(canvasState.origin.y, canvasState.current.y);
  let width = Math.abs(canvasState.origin.x - canvasState.current.x);
  let height = Math.abs(canvasState.origin.y - canvasState.current.y);

  return (
    <>
      <rect
        className="fill-blue-500/5 stroke-blue-500 stroke-1"
        style={{
          transform: `translate(${x}px, ${y}px)`,
        }}
        x={0}
        y={0}
        width={width}
        height={height}
      />

      {canvasState.mode === CanvasMode.Inserting &&
        Math.abs(canvasState.current.x - canvasState.origin.x) +
          Math.abs(canvasState.current.y - canvasState.origin.y) >
          INSERT_LAYER_THRESHOLD && (
          <foreignObject
            style={{
              transform: `translate(${x + width / 2 - 65}px, ${y + height + 16}px)`,
            }}
            className="bg-blue-500/80 select-none rounded-md"
            width={130}
            height={26}
          >
            <div className="w-full h-full flex items-center justify-center text-white font-semibold">
              {width} x {height}
            </div>
          </foreignObject>
        )}
    </>
  );
});

SelectionNet.displayName = "SelectionNet";
