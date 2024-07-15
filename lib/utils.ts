import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { Camera, Color, Layer, LayerType, PathLayer, Point, Side, XYWH } from "@/types/canvas";

const COLORS = ["#D97706", "#059669", "#7C3AED", "#DB2777", "#DC2626"];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function connectionIdToColor(connectionId: number): string {
  return COLORS[connectionId % COLORS.length];
}

export function pointerEventToCanvasPoint(e: React.PointerEvent, camera: Camera) {
  return {
    x: Math.round(e.clientX) - camera.x,
    y: Math.round(e.clientY) - camera.y,
  };
}

export function colorToCss(color: Color) {
  return `#${color.r.toString(16).padStart(2, "0")}${color.g.toString(16).padStart(2, "0")}${color.b.toString(16).padStart(2, "0")}`;
}

export const boundingBox = (layers: Layer[]): XYWH | null => {
  const first = layers[0];

  if (!first) {
    return null;
  }

  let left = first.x;
  let right = first.x + first.width;
  let top = first.y;
  let bottom = first.y + first.height;

  // 计算边界
  for (let i = 1; i < layers.length; i++) {
    const { x, y, width, height } = layers[i];

    if (left > x) {
      left = x;
    }

    if (right < x + width) {
      right = x + width;
    }

    if (top > y) {
      top = y;
    }

    if (bottom < y + height) {
      bottom = y + height;
    }
  }

  return {
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
  };
};

export function resizeBounds(bounds: XYWH, corner: Side, point: Point): XYWH {
  const result = {
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
  };

  // 用 按位与运算符 & 来判断是否包含某个方位
  // 例子: corner = Side.Top + Side.Left = 5 = 0101
  // corner & Side.Top = 0101 & 0001 = 0001 = 1 = Side.Top
  // 表示 corner 此时包含 Side.Top

  if ((corner & Side.Left) === Side.Left) {
    result.x = Math.min(point.x, bounds.x + bounds.width);
    result.width = Math.abs(bounds.x + bounds.width - point.x);
  }

  if ((corner & Side.Right) === Side.Right) {
    result.x = Math.min(point.x, bounds.x);
    result.width = Math.abs(point.x - bounds.x);
  }

  if ((corner & Side.Top) === Side.Top) {
    result.y = Math.min(point.y, bounds.y + bounds.height);
    result.height = Math.abs(bounds.y + bounds.height - point.y);
  }

  if ((corner & Side.Bottom) === Side.Bottom) {
    result.y = Math.min(point.y, bounds.y);
    result.height = Math.abs(point.y - bounds.y);
  }

  return result;
}

export const findIntersectingLayersWithRectangle = (
  layerIds: readonly string[],
  layers: ReadonlyMap<string, Layer>,
  a: Point,
  b: Point
) => {
  const rect = {
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    width: Math.abs(a.x - b.x),
    height: Math.abs(a.y - b.y),
  };

  const ids = [];

  for (let layerId of layerIds) {
    const layer = layers.get(layerId);

    if (layer == null) {
      continue;
    }

    const { x, y, width, height } = layer;

    if (rect.x + rect.width > x && rect.x < x + width && rect.y + rect.height > y && rect.y < y + height) {
      ids.push(layerId);
    }
  }

  return ids;
};

// 获取对比文本颜色
export function getContrastingTextColor(color: Color) {
  const luminance = 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;

  return luminance > 182 ? "black" : "white";
}

export function penPointsToPathLayer(points: number[][], color: Color): PathLayer {
  if (points.length < 2) {
    throw new Error("draw points less than 2");
  }

  let left = Number.POSITIVE_INFINITY;
  let top = Number.POSITIVE_INFINITY;
  let right = Number.NEGATIVE_INFINITY;
  let bottom = Number.NEGATIVE_INFINITY;

  for (const point of points) {
    const [x, y] = point;

    // 计算最小 x 坐标
    if (left > x) {
      left = x;
    }

    // 计算最小 y 坐标
    if (top > y) {
      top = y;
    }

    // 计算最大 x 坐标
    if (right < x) {
      right = x;
    }
    // 计算最大 y 坐标
    if (bottom < y) {
      bottom = y;
    }
  }

  return {
    type: LayerType.Path,
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
    fill: color,
    // 将每个点的 x 和 y 坐标归一化为相对于路径层左上角的坐标，压力值保持不变
    points: points.map(([x, y, pressure]) => [x - left, y - top, pressure]),
  };
}

// 计算 SVG 路径字符串
export function getSvgPathFromStroke(stroke: number[][]) {
  if (!stroke.length) return "";

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      //  计算二次贝塞尔曲线
      const [x1, y1] = arr[(i + 1) % arr.length];
      // 计算当前点和下一个点的中点
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },

    /**
     * "M" 是 SVG 的移动命令，表示移动到第一个点（stroke[0]）
     * "Q" 是二次贝塞尔曲线命令，用于绘制平滑的曲线
     */
    ["M", ...stroke[0], "Q"]
  );

  // "Z" 命令用于闭合路径，即从当前点绘制一条直线回到起点
  d.push("Z");
  return d.join(" ");
}
