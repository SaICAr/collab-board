"use client";

import { memo } from "react";
import { useStorage } from "@liveblocks/react/suspense";

import { colorToCss } from "@/lib/utils";
import { LayerType } from "@/types/canvas";

import { Rectangle } from "./layers/rectangle";
import { Ellipse } from "./layers/ellipse";
import { Text } from "./layers/text";
import { Note } from "./layers/note";
import { Path } from "./layers/path";
import { Image } from "./layers/image";

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
    case LayerType.Image:
      // eslint-disable-next-line jsx-a11y/alt-text
      return <Image id={id} layer={layer} onPointerDown={onLayerPointerDown} selectionColor={selectionColor} />;
    case LayerType.Path:
      return (
        <Path
          key={id}
          x={layer.x}
          y={layer.y}
          points={layer.points}
          fill={layer.fill ? colorToCss(layer.fill) : "#000"}
          onPointerDown={(e) => onLayerPointerDown(e, id)}
          stroke={selectionColor}
        />
      );
    case LayerType.Note:
      return <Note id={id} layer={layer} onPointerDown={onLayerPointerDown} selectionColor={selectionColor} />;
    case LayerType.Text:
      return <Text id={id} layer={layer} onPointerDown={onLayerPointerDown} selectionColor={selectionColor} />;
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
