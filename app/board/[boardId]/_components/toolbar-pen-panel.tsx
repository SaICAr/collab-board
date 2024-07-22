"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { usePencilStore } from "@/store/use-pencil";
import { ColorPicker } from "./color-picker";

export const ToolbarPenPanel = ({ children }: { children: React.ReactNode }) => {
  const { pencilColor, pencilSize, setPencilSize, setPencilColor } = usePencilStore();

  return (
    <Popover>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent
        side="right"
        sideOffset={14}
        className="max-w-[180px] flex flex-col gap-y-2 font-semibold text-sm"
      >
        <div className="flex justify-between">
          <div>画笔大小</div>
          <div>{pencilSize}px</div>
        </div>
        <Slider defaultValue={[pencilSize]} min={2} max={32} step={2} onValueChange={([size]) => setPencilSize(size)} />

        <div className="mt-3">画笔颜色</div>
        <ColorPicker currentColor={pencilColor} onChange={setPencilColor} />
      </PopoverContent>
    </Popover>
  );
};
