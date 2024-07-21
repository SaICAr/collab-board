"use client";

import { useState } from "react";
import { useMutation, useStorage } from "@liveblocks/react/suspense";
import { Check, Plus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/hint";
import { Label } from "@/components/ui/label";
import { getContrastingTextColor } from "@/lib/utils";

interface ColorPickerProps {
  currentColor: string;
  onChange: (color: string) => void;
}

export const ColorPicker = ({ currentColor, onChange }: ColorPickerProps) => {
  const layerColors = useStorage((root) => root.layerColors);
  const [customized, setCustomized] = useState(false);
  const [open, setOpen] = useState(false);

  const handleCustomColor = useMutation(
    ({ storage }, e: React.ChangeEvent<HTMLInputElement>) => {
      const color = e.target.value;
      if (color) {
        const liveColors = storage.get("layerColors");

        if (liveColors.indexOf(color) === -1) {
          if (!customized) {
            liveColors.push(color);
          } else {
            liveColors.set(liveColors.length - 1, color);
          }

          setCustomized(true);
        }

        onChange(color);
      }
    },
    [customized, onChange]
  );

  return (
    <div className="flex items-center">
      <Popover open={open}>
        <PopoverTrigger>
          <Hint label="填充">
            <div
              className="w-8 h-8 rounded-full border border-neutral-300 hover:opacity-75 transition"
              style={{ background: currentColor }}
              onClick={() => setOpen(!open)}
            />
          </Hint>
        </PopoverTrigger>
        <PopoverContent sideOffset={16} className="w-[196px] grid grid-cols-4 gap-2 place-items-center">
          {layerColors.map((color, index) => (
            <ColorButton key={index} color={color} active={!!(currentColor === color)} onClick={onChange} />
          ))}

          <div className="w-8 h-8 flex items-center justify-center">
            <Hint label="自定义颜色" sideOffset={8}>
              <Label htmlFor="custom-fill-color">
                <Button asChild className="w-6 h-6 hover:bg-inherit" size="icon" variant="ghost">
                  <Plus className="opacity-45 hover:opacity-80 cursor-pointer" />
                </Button>
              </Label>
            </Hint>
            <input onChange={handleCustomColor} id="custom-fill-color" type="color" className="w-0 h-0 opacity-0 p-0" />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

interface ColorButtonProps {
  onClick: (color: string) => void;
  color: string;
  active?: boolean;
}

const ColorButton = ({ color, active, onClick }: ColorButtonProps) => {
  return (
    <Hint label={color}>
      <Button
        asChild
        className="w-8 h-8 items-center flex justify-center hover:opacity-75 transition"
        onClick={() => onClick(color)}
      >
        <div
          className="relative flex items-center justify-center w-8 h-8 border border-neutral-300 cursor-pointer"
          style={{ background: color }}
        >
          {active && <Check className="absolute" style={{ color: getContrastingTextColor(color) }} />}
        </div>
      </Button>
    </Hint>
  );
};
