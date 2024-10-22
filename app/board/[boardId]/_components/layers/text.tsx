import { useEffect, useRef } from "react";
import { Kalam } from "next/font/google";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";

import { cn } from "@/lib/utils";
import { TextLayer } from "@/types/canvas";
import { useMutation } from "@liveblocks/react/suspense";

interface TextProps {
  id: string;
  layer: TextLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

const font = Kalam({
  subsets: ["latin"],
  weight: ["400"],
});

const calculateFontSize = (width: number, height: number) => {
  const maxFontSize = 96;
  const scale = 0.5;
  const fontSizeBasedOnHeight = height * scale;
  const fontSizeBasedOnWidth = width * scale;

  return Math.min(fontSizeBasedOnHeight, fontSizeBasedOnWidth, maxFontSize);
};

export const Text = ({ id, layer, onPointerDown, selectionColor }: TextProps) => {
  const elRef = useRef<HTMLElement>(null);
  const { height, width, fill, value, transform } = layer;

  const updateValue = useMutation(({ storage }, newValue: string) => {
    const liveLayers = storage.get("layers");

    liveLayers.get(id)?.set("value", newValue);
  }, []);

  const handleContentChange = (e: ContentEditableEvent) => {
    updateValue(e.target.value);
  };

  useEffect(() => {
    if (elRef) {
      elRef.current?.focus();
    }
  }, []);

  return (
    <foreignObject
      style={{
        transform: `matrix(${transform})`,
        outline: selectionColor ? `1px solid ${selectionColor}` : "none",
      }}
      width={width}
      height={height}
      onPointerDown={(e) => onPointerDown(e, id)}
    >
      <ContentEditable
        innerRef={elRef}
        html={value ?? ""}
        onChange={handleContentChange}
        className={cn(
          "w-full h-full flex justify-center items-center text-center drop-shadow-md outline-none",
          font.className
        )}
        style={{ color: fill ?? "#000", fontSize: calculateFontSize(width, height) }}
      />
    </foreignObject>
  );
};
