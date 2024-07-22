import { getSvgPathFromStroke } from "@/lib/utils";
import { MatrixArr } from "@/types/canvas";
import getStroke from "perfect-freehand";

interface PathProps {
  x: number;
  y: number;
  points: number[][];
  fill: string;
  size: number;
  onPointerDown?: (e: React.PointerEvent) => void;
  transform?: MatrixArr;
  stroke?: string;
}

export const Path = ({ x, y, points, fill, size, onPointerDown, transform, stroke }: PathProps) => {
  return (
    <path
      className="drop-shadow-md"
      onPointerDown={onPointerDown}
      d={getSvgPathFromStroke(
        getStroke(points, { size, thinning: 0.5, smoothing: 0.5, streamline: 0.5, simulatePressure: true })
      )}
      style={{ transform: transform ? `matrix(${transform})` : `translate(${x}px, ${y}px)` }}
      x={0}
      y={0}
      fill={fill}
      stroke={stroke}
      strokeWidth={1}
    />
  );
};
