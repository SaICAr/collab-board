"use client";

import { memo } from "react";
import { useMutation, useSelf } from "@liveblocks/react/suspense";

import { useDeleteLayers } from "@/hooks/use-delete-layers";
import { useSelectionBounds } from "@/hooks/use-selection-bounds";
import { Camera, Color } from "@/types/canvas";
import { HANDLE_WIDTH } from "./selection-box";
import { ColorPicker } from "./color-picker";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface SelectionToolsProps {
  camera: Camera;
  setLastUsedColor: (color: Color) => void;
}

export const SelectionTools = memo(({ camera, setLastUsedColor }: SelectionToolsProps) => {
  const selection = useSelf((me) => me.presence.selection);

  const setFill = useMutation(
    ({ storage }, fill: Color) => {
      const liveLayers = storage.get("layers");
      setLastUsedColor(fill);

      selection.forEach((id) => {
        liveLayers.get(id)?.set("fill", fill);
      });
    },
    [selection, setLastUsedColor]
  );

  const selectionBounds = useSelectionBounds();

  const deleteLayers = useDeleteLayers();

  if (!selectionBounds) {
    return null;
  }

  const x = selectionBounds.width / 2 + selectionBounds.x + camera.x;
  const y = selectionBounds.y + camera.y;

  return (
    <div
      className="absolute p-3 rounded-xl bg-white shadow-sm border flex select-none"
      style={{
        transform: `translate(calc(${x}px - 50%), calc(${y}px - 100% - ${HANDLE_WIDTH * 2}px))`,
      }}
    >
      <ColorPicker onChange={setFill} />
      <div className="flex items-center pl-2 ml-2 border-l border-neutral-200">
        <Button variant="board" size="icon" onClick={deleteLayers}>
          <Trash2 />
        </Button>
      </div>
    </div>
  );
});

SelectionTools.displayName = "SelectionTools";
