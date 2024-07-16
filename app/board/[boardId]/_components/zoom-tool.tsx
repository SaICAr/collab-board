"use client";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { useFullScreen } from "@/hooks/use-full-screen";
import { Maximize, Minimize, ZoomIn, ZoomOut } from "lucide-react";

export const ZoomTool = () => {
  const { isFullScreen, openFullScreen, closeFullScreen } = useFullScreen();

  return (
    <div
      className="absolute h-12 bottom-2 right-2 bg-white rounded-md p-1.5 
      flex items-center shadow-md"
    >
      <div className="flex gap-x-2">
        <Hint label={isFullScreen ? "取消全屏" : "进入全屏"} sideOffset={8}>
          {isFullScreen ? (
            <Button size="icon" variant="board" onClick={closeFullScreen}>
              <Minimize />
            </Button>
          ) : (
            <Button size="icon" variant="board" onClick={openFullScreen}>
              <Maximize />
            </Button>
          )}
        </Hint>
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
