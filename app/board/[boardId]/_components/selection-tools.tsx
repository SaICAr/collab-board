"use client";

import { memo, useMemo } from "react";
import { BringToFront, SendToBack, Trash2 } from "lucide-react";
import { useMutation, useSelf, useStorage } from "@liveblocks/react/suspense";

import { useDeleteLayers } from "@/hooks/use-delete-layers";
import { useSelectionBounds } from "@/hooks/use-selection-bounds";
import { Camera } from "@/types/canvas";
import { HANDLE_WIDTH } from "./selection-box";
import { ColorPicker } from "./color-picker";
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/hint";
import { DEFAULT_COLOR } from "./canvas";
import { TabSeparator } from "@/components/tab-separator";

interface SelectionToolsProps {
  camera: Camera;
  lastUsedColor: string;
  setLastUsedColor: (color: string) => void;
}

export const SelectionTools = memo(({ camera, lastUsedColor, setLastUsedColor }: SelectionToolsProps) => {
  const liveLayers = useStorage((root) => root.layers);
  const selections = useSelf((me) => me.presence.selection);

  const currentColor = useMemo(() => {
    if (selections.length) {
      const layer = liveLayers.get(selections[0]);
      if (layer) {
        return layer.fill ?? DEFAULT_COLOR;
      }
    }

    return DEFAULT_COLOR;
  }, [selections, liveLayers]);

  const setFill = useMutation(
    ({ storage }, fill: string) => {
      const liveLayers = storage.get("layers");
      setLastUsedColor(fill);

      selections.forEach((id) => {
        liveLayers.get(id)?.set("fill", fill);
      });
    },
    [selections, setLastUsedColor]
  );

  const selectionBounds = useSelectionBounds();

  const deleteLayers = useDeleteLayers();

  const moveToFront = useMutation(
    ({ storage }) => {
      const liveLayerIds = storage.get("layerIds");
      const indices: number[] = [];
      const arr = liveLayerIds.toImmutable();

      for (let i = 0; i < arr.length; i++) {
        if (selections.includes(arr[i])) {
          indices.push(i);
        }
      }

      // 索引越靠前，层级越低，反之越高
      for (let i = indices.length - 1; i >= 0; i--) {
        // 保持各布局之间的相对层级
        liveLayerIds.move(indices[i], arr.length - 1 - (indices.length - 1 - i));
      }
    },
    [selections]
  );

  const moveToBack = useMutation(
    ({ storage }) => {
      const liveLayerIds = storage.get("layerIds");
      const indices: number[] = [];
      const arr = liveLayerIds.toImmutable();

      for (let i = 0; i < arr.length; i++) {
        if (selections.includes(arr[i])) {
          indices.push(i);
        }
      }

      // 索引越靠前，层级越低，反之越高
      for (let i = 0; i < indices.length; i++) {
        liveLayerIds.move(indices[i], i);
      }
    },
    [selections]
  );

  if (!selectionBounds) {
    return null;
  }

  const x = selectionBounds.width / 2 + selectionBounds.x + camera.x;
  const y = selectionBounds.y + camera.y;

  return (
    <div
      className="absolute p-3 rounded-xl bg-white shadow-sm border flex select-none items-center gap-x-0.5"
      style={{
        transform: `translate(calc(${x}px - 50%), calc(${y}px - 100% - ${HANDLE_WIDTH * 2}px))`,
      }}
    >
      <Hint label="填充" sideOffset={8}>
        <ColorPicker currentColor={currentColor} onChange={setFill} />
      </Hint>

      <TabSeparator />

      <div className="flex gap-x-0.5">
        <Hint label="置为顶层" sideOffset={8}>
          <Button variant="board" size="icon" onClick={moveToFront}>
            <BringToFront />
          </Button>
        </Hint>

        <Hint label="置为底层" sideOffset={8}>
          <Button variant="board" size="icon" onClick={moveToBack}>
            <SendToBack />
          </Button>
        </Hint>
      </div>

      <TabSeparator />

      <Hint label="删除" sideOffset={8}>
        <Button variant="board" size="icon" onClick={deleteLayers}>
          <Trash2 />
        </Button>
      </Hint>
    </div>
  );
});

SelectionTools.displayName = "SelectionTools";
