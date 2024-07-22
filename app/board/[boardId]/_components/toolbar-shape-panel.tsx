"use client";

import { Popover, PopoverContent } from "@/components/ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { ColorPicker } from "./color-picker";
import { useGraphStore } from "@/store/use-graph";

export const ToolbarShapePanel = ({ children }: { children: React.ReactNode }) => {
  const { graphColor, setGraphColor } = useGraphStore();

  return (
    <Popover>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent side="right" sideOffset={14} className="max-w-[180px]">
        <ColorPicker currentColor={graphColor} onChange={setGraphColor} />
      </PopoverContent>
    </Popover>
  );
};
