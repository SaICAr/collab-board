import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

export interface HintProps {
  label: string;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  alignOffset?: number;
  delayDuration?: number;
}

export const Hint = ({ label, children, side, align, sideOffset, alignOffset, delayDuration = 100 }: HintProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={delayDuration}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
          className="text-white bg-black border-black"
        >
          <p className="font-semibold">{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
