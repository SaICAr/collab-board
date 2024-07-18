import { useEffect, useRef } from "react";
import { Kalam } from "next/font/google";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";

import { cn, colorToCss, getContrastingTextColor } from "@/lib/utils";
import { NoteLayer } from "@/types/canvas";
import { useMutation } from "@liveblocks/react/suspense";

interface NoteProps {
  id: string;
  layer: NoteLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

const font = Kalam({
  subsets: ["latin"],
  weight: ["400"],
});

const calculateFontSize = (width: number, height: number) => {
  const maxFontSize = 96;
  const scale = 0.15;
  const fontSizeBasedOnHeight = height * scale;
  const fontSizeBasedOnWidth = width * scale;

  return Math.min(fontSizeBasedOnHeight, fontSizeBasedOnWidth, maxFontSize);
};

export const Note = ({ id, layer, onPointerDown, selectionColor }: NoteProps) => {
  const elRef = useRef<HTMLElement>(null);
  const { width, height, fill, value, transform } = layer;

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
        backgroundColor: fill ? colorToCss(fill) : "#D97706",
      }}
      className="shadow-md drop-shadow-xl"
      width={width}
      height={height}
      onPointerDown={(e) => onPointerDown(e, id)}
    >
      <ContentEditable
        innerRef={elRef}
        html={value ?? "Note!"}
        onChange={handleContentChange}
        className={cn("w-full h-full flex justify-center items-center text-center  outline-none", font.className)}
        style={{ color: fill ? getContrastingTextColor(fill) : "#000", fontSize: calculateFontSize(width, height) }}
      />
    </foreignObject>
  );
};
