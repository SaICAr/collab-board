"use client";

import { memo, useEffect, useMemo } from "react";

import { MatrixArr, Side, XYWH } from "@/types/canvas";
import { useSelectionBounds } from "@/hooks/use-selection-bounds";
import { useSelf, useStorage } from "@liveblocks/react/suspense";
import { Matrix } from "pixi.js";
import { getInitTransform, matrixToArray } from "@/lib/utils";

interface SelectionBoxProps {
  onResizeHandlePointerDown: (corner: Side, initialBounds: XYWH) => void;
}

export const HANDLE_WIDTH = 8;

export const SelectionBox = memo(({ onResizeHandlePointerDown }: SelectionBoxProps) => {
  const bounds = useSelectionBounds();
  const layers = useStorage((root) => root.layers);
  const selections = useSelf((me) => me.presence.selection);

  const transform = useMemo<MatrixArr>(() => {
    if (!bounds) {
      return matrixToArray(new Matrix());
    }

    if (selections.length === 1) {
      const layer = layers.get(selections[0]);
      if (layer) {
        return layer.transform;
      }
    }

    return getInitTransform({ x: bounds.x, y: bounds.y });
  }, [bounds, layers, selections]);

  const handles = useMemo(() => {
    if (!bounds || !transform) return [];

    const zero = { x: 0, y: 0 };
    const sX = Math.sign(transform[0]);
    const sY = Math.sign(transform[3]);

    // 找到transform后对应的坐标
    const leftTop = new Matrix(...transform).translate(0, 0).apply(zero);
    const rightTop = new Matrix(...transform).translate(sX * bounds.width, 0).apply(zero);
    const leftBottom = new Matrix(...transform).translate(0, sY * bounds.height).apply(zero);
    const rightBottom = new Matrix(...transform).translate(sX * bounds.width, sY * bounds.height).apply(zero);
    const top = new Matrix(...transform).translate((sX * bounds.width) / 2, 0).apply(zero);
    const bottom = new Matrix(...transform).translate((sX * bounds.width) / 2, sY * bounds.height).apply(zero);
    const left = new Matrix(...transform).translate(0, (sY * bounds.height) / 2).apply(zero);
    const right = new Matrix(...transform).translate(sX * bounds.width, (sY * bounds.height) / 2).apply(zero);

    return [
      {
        cursor: "nwse-resize",
        x: leftTop.x - HANDLE_WIDTH / 2,
        y: leftTop.y - HANDLE_WIDTH / 2,
        onPointerDown: (e: React.PointerEvent) => {
          e.stopPropagation();
          onResizeHandlePointerDown(Side.Top + Side.Left, bounds);
        },
      },
      {
        cursor: "ns-resize",
        x: top.x - HANDLE_WIDTH / 2,
        y: top.y - HANDLE_WIDTH / 2,
        onPointerDown: (e: React.PointerEvent) => {
          e.stopPropagation();
          onResizeHandlePointerDown(Side.Top, bounds);
        },
      },
      {
        cursor: "nesw-resize",
        x: rightTop.x - HANDLE_WIDTH / 2,
        y: rightTop.y - HANDLE_WIDTH / 2,
        onPointerDown: (e: React.PointerEvent) => {
          e.stopPropagation();
          onResizeHandlePointerDown(Side.Top + Side.Right, bounds);
        },
      },
      {
        cursor: "ew-resize",
        x: right.x - HANDLE_WIDTH / 2,
        y: right.y - HANDLE_WIDTH / 2,
        onPointerDown: (e: React.PointerEvent) => {
          e.stopPropagation();
          onResizeHandlePointerDown(Side.Right, bounds);
        },
      },
      {
        cursor: "nwse-resize",
        x: rightBottom.x - HANDLE_WIDTH / 2,
        y: rightBottom.y - HANDLE_WIDTH / 2,
        onPointerDown: (e: React.PointerEvent) => {
          e.stopPropagation();
          onResizeHandlePointerDown(Side.Right + Side.Bottom, bounds);
        },
      },
      {
        cursor: "ns-resize",
        x: bottom.x - HANDLE_WIDTH / 2,
        y: bottom.y - HANDLE_WIDTH / 2,
        onPointerDown: (e: React.PointerEvent) => {
          e.stopPropagation();
          onResizeHandlePointerDown(Side.Bottom, bounds);
        },
      },
      {
        cursor: "nesw-resize",
        x: leftBottom.x - HANDLE_WIDTH / 2,
        y: leftBottom.y - HANDLE_WIDTH / 2,
        onPointerDown: (e: React.PointerEvent) => {
          e.stopPropagation();
          onResizeHandlePointerDown(Side.Bottom + Side.Left, bounds);
        },
      },
      {
        cursor: "ew-resize",
        x: left.x - HANDLE_WIDTH / 2,
        y: left.y - HANDLE_WIDTH / 2,
        onPointerDown: (e: React.PointerEvent) => {
          e.stopPropagation();
          onResizeHandlePointerDown(Side.Left, bounds);
        },
      },
    ];
  }, [bounds, onResizeHandlePointerDown, transform]);

  if (!bounds) {
    return null;
  }

  return (
    <>
      <rect
        className="fill-transparent stroke-blue-500 stroke-1 pointer-events-none"
        style={{ transform: `translate(${bounds.x}px, ${bounds.y}px)` }}
        x={0}
        y={0}
        width={bounds.width}
        height={bounds.height}
      />

      {handles.map((handle, index) => (
        <rect
          key={index}
          className="fill-white stroke-1 stroke-blue-500"
          x={0}
          y={0}
          style={{
            cursor: handle.cursor,
            width: `${HANDLE_WIDTH}px`,
            height: `${HANDLE_WIDTH}px`,
            transform: `translate(${handle.x}px, ${handle.y}px)`,
          }}
          onPointerDown={handle.onPointerDown}
        />
      ))}

      <foreignObject
        style={{
          transform: `translate(${bounds.x + bounds.width / 2 - 65}px, ${bounds.y + bounds.height + 16}px)`,
        }}
        className="bg-blue-500/80 select-none rounded-md"
        width={130}
        height={26}
      >
        <div className="w-full h-full flex items-center justify-center text-white font-semibold">
          {Math.round(bounds.width)} x {Math.round(bounds.height)}
        </div>
      </foreignObject>
    </>
  );
});

SelectionBox.displayName = "SelectionBox";
