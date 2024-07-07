"use client";

import { memo } from "react";
import { useStorage } from "@liveblocks/react/suspense";
import { LayerType } from "@/types/canvas";
import { Rectangle } from "./layers/rectangle";
import { Ellipse } from "./layers/ellipse";

interface LayerPreviewProps {
  id: string;
  onLayerPointerDown: (e: React.PointerEvent, layerId: string) => void;
  selectionColor?: string;
}

export const LayerPreview = memo(({ id, onLayerPointerDown, selectionColor }: LayerPreviewProps) => {
  const layer = useStorage((root) => root.layers.get(id));

  if (!layer) {
    return null;
  }

  switch (layer.type) {
    case LayerType.Ellipse:
      return <Ellipse id={id} layer={layer} onPointerDown={onLayerPointerDown} selectionColor={selectionColor} />;
    case LayerType.Rectangle:
      return <Rectangle id={id} layer={layer} onPointerDown={onLayerPointerDown} selectionColor={selectionColor} />;
    default:
      console.warn("Layer Preview Error: 未知layer类型");
      return null;
  }
});

LayerPreview.displayName = "LayerPreview";
