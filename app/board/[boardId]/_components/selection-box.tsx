"use client";

import { memo, useMemo } from "react";

import { Side, XYWH } from "@/types/canvas";
import { useSelectionBounds } from "@/hooks/use-selection-bounds";

interface SelectionBoxProps {
  onResizeHandlePointerDown: (corner: Side, initialBounds: XYWH) => void;
}

export const HANDLE_WIDTH = 8;

export const SelectionBox = memo(({ onResizeHandlePointerDown }: SelectionBoxProps) => {
  const bounds = useSelectionBounds();

  const handles = useMemo(() => {
    if (!bounds) return [];

    return [
      {
        cursor: "nwse-resize",
        x: bounds.x - HANDLE_WIDTH / 2,
        y: bounds.y - HANDLE_WIDTH / 2,
        onPointerDown: (e: React.PointerEvent) => {
          e.stopPropagation();
          onResizeHandlePointerDown(Side.Top + Side.Left, bounds);
        },
      },
      {
        cursor: "ns-resize",
        x: bounds.x + bounds.width / 2 - HANDLE_WIDTH / 2,
        y: bounds.y - HANDLE_WIDTH / 2,
        onPointerDown: (e: React.PointerEvent) => {
          e.stopPropagation();
          onResizeHandlePointerDown(Side.Top, bounds);
        },
      },
      {
        cursor: "nesw-resize",
        x: bounds.x + bounds.width - HANDLE_WIDTH / 2,
        y: bounds.y - HANDLE_WIDTH / 2,
        onPointerDown: (e: React.PointerEvent) => {
          e.stopPropagation();
          onResizeHandlePointerDown(Side.Top + Side.Right, bounds);
        },
      },
      {
        cursor: "ew-resize",
        x: bounds.x + bounds.width - HANDLE_WIDTH / 2,
        y: bounds.y + bounds.height / 2 - HANDLE_WIDTH / 2,
        onPointerDown: (e: React.PointerEvent) => {
          e.stopPropagation();
          onResizeHandlePointerDown(Side.Right, bounds);
        },
      },
      {
        cursor: "nwse-resize",
        x: bounds.x + bounds.width - HANDLE_WIDTH / 2,
        y: bounds.y + bounds.height - HANDLE_WIDTH / 2,
        onPointerDown: (e: React.PointerEvent) => {
          e.stopPropagation();
          onResizeHandlePointerDown(Side.Right + Side.Bottom, bounds);
        },
      },
      {
        cursor: "ns-resize",
        x: bounds.x + bounds.width / 2 - HANDLE_WIDTH / 2,
        y: bounds.y + bounds.height - HANDLE_WIDTH / 2,
        onPointerDown: (e: React.PointerEvent) => {
          e.stopPropagation();
          onResizeHandlePointerDown(Side.Bottom, bounds);
        },
      },
      {
        cursor: "nesw-resize",
        x: bounds.x - HANDLE_WIDTH / 2,
        y: bounds.y + bounds.height - HANDLE_WIDTH / 2,
        onPointerDown: (e: React.PointerEvent) => {
          e.stopPropagation();
          onResizeHandlePointerDown(Side.Bottom + Side.Left, bounds);
        },
      },
      {
        cursor: "ew-resize",
        x: bounds.x - HANDLE_WIDTH / 2,
        y: bounds.y + bounds.height / 2 - HANDLE_WIDTH / 2,
        onPointerDown: (e: React.PointerEvent) => {
          e.stopPropagation();
          onResizeHandlePointerDown(Side.Left, bounds);
        },
      },
    ];
  }, [bounds, onResizeHandlePointerDown]);

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
