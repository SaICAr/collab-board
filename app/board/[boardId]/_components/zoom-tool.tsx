"use client";

import { Button } from "@/components/ui/button";
import { Maximize, Minimize, ZoomIn, ZoomOut } from "lucide-react";

export const ZoomTool = () => {
  return (
    <div
      className="absolute h-12 bottom-2 right-2 bg-white rounded-md p-1.5 
      flex items-center shadow-md"
    >
      <div className="flex gap-x-2">
        <Button size="icon" variant="board">
          <Maximize />
        </Button>
        {/* <Minimize /> */}
        <Button size="icon" variant="board">
          <ZoomOut />
        </Button>

        <Button size="icon" variant="board">
          <div className="font-semibold">100%</div>
        </Button>

        <Button size="icon" variant="board">
          <ZoomIn />
        </Button>
      </div>
    </div>
  );
};

ZoomTool.Skeleton = function ZoomToolSkeleton() {
  return (
    <div
      className="absolute h-12 w-[208px] bottom-2 right-2 bg-white rounded-md p-1.5 
      flex items-center shadow-md"
    />
  );
};
