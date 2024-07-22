"use client";

import { Popover, PopoverContent } from "@/components/ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { ColorPicker } from "./color-picker";
import { useTextStore } from "@/store/use-text";

export const ToolbarTextPanel = ({ children }: { children: React.ReactNode }) => {
  const { textColor, setTextColor } = useTextStore();

  return (
    <Popover>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent
        side="right"
        sideOffset={14}
        className="max-w-[180px] flex flex-col gap-y-2 font-semibold text-sm"
      >
        <div>字体颜色</div>
        <ColorPicker currentColor={textColor} onChange={setTextColor} />
      </PopoverContent>
    </Popover>
  );
};
