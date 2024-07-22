"use client";

import { memo, useMemo, useState } from "react";
import { BringToFront, Circle, Image, SendToBack, Square, StickyNote, Trash2, Type } from "lucide-react";
import { useMutation, useSelf, useStorage } from "@liveblocks/react/suspense";

import { useDeleteLayers } from "@/hooks/use-delete-layers";
import { useSelectionBounds } from "@/hooks/use-selection-bounds";
import { Camera, InsertableLayerType, LayerType } from "@/types/canvas";
import { HANDLE_WIDTH } from "./selection-box";
import { ColorPicker } from "./color-picker";
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/hint";
import { DEFAULT_COLOR } from "./canvas";
import { TabSeparator } from "@/components/tab-separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface SelectionToolsProps {
  camera: Camera;
}

interface SwitchShapeProps {
  type: InsertableLayerType;
}

const SwitchShape = ({ type }: SwitchShapeProps) => {
  const [open, setOpen] = useState(false);

  const shapeIcons: Record<InsertableLayerType, React.ReactNode> = {
    [LayerType.Rectangle]: <Square />,
    [LayerType.Ellipse]: <Circle />,
    [LayerType.Note]: <StickyNote />,
    [LayerType.Text]: <Type />,
    [LayerType.Image]: <Image />,
  };

  const switchShape = useMutation(({ storage, self }, type: InsertableLayerType) => {
    const liveLayers = storage.get("layers");
    const selections = self.presence.selection;
    const layer = liveLayers.get(selections[0]);

    if (layer) {
      layer.set("type", type);
    }

    setOpen(false);
  }, []);

  return (
    <Popover open={open}>
      <PopoverTrigger>
        <Hint label="切换图形">
          <Button size="icon" variant="board" onClick={() => setOpen(true)}>
            {shapeIcons[type]}
          </Button>
        </Hint>
      </PopoverTrigger>
      <PopoverContent className="max-w-[140px]" sideOffset={12}>
        <div className="grid grid-cols-3 gap-2 place-items-center">
          {Object.entries(shapeIcons).map(([type, Icon]) => (
            <div key={type} className="cursor-pointer" onClick={() => switchShape(Number(type))}>
              {Icon}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export const SelectionTools = memo(({ camera }: SelectionToolsProps) => {
  const liveLayers = useStorage((root) => root.layers);
  const selections = useSelf((me) => me.presence.selection);
  const soloLayer = useMemo(
    () => (selections.length === 1 ? liveLayers.get(selections[0]) : null),
    [selections, liveLayers]
  );
  const [open, setOpen] = useState(false);

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

      selections.forEach((id) => {
        liveLayers.get(id)?.set("fill", fill);
      });
    },
    [selections]
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
      {soloLayer && soloLayer.type !== LayerType.Path && (
        <>
          <SwitchShape type={soloLayer.type} />

          <TabSeparator />
        </>
      )}

      <Popover open={open}>
        <PopoverTrigger>
          <Hint label="填充" sideOffset={8}>
            <div
              className="w-8 h-8 rounded-full border border-neutral-300 hover:opacity-75 transition"
              style={{ background: currentColor }}
              onClick={() => setOpen(!open)}
            />
          </Hint>
        </PopoverTrigger>
        <PopoverContent sideOffset={16} className="w-[196px]">
          <ColorPicker currentColor={currentColor} onChange={setFill} />
        </PopoverContent>
      </Popover>

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
