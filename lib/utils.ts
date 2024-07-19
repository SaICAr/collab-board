import { Matrix } from "pixi.js";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import {
  Camera,
  Color,
  Layer,
  LayerType,
  PathLayer,
  Point,
  ResizeOp,
  Side,
  MatrixArr,
  TransformRect,
  XYWH,
} from "@/types/canvas";

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
    transform: [1, 0, 0, 1, left, top],
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

const doubleSize = (width: number, height: number) => ({
  width: width * 2,
  height: height * 2,
});

// 不同控制点对应的操作
const resizeOps: Record<string, ResizeOp> = {
  [Side.Top + Side.Left]: {
    getLocalOrigin: (width, height) => {
      return { x: width, y: height };
    },
    getNewSize: (newLocalPt, localOrigin) => {
      return {
        width: localOrigin.x - newLocalPt.x,
        height: localOrigin.y - newLocalPt.y,
      };
    },
    isBaseWidthWhenKeepRatio: (isWidthLarger: boolean) => isWidthLarger,
    getSizeWhenScaleFromCenter: doubleSize,
  },
  [Side.Top]: {
    getLocalOrigin: (width, height) => ({ x: width / 2, y: height }),
    getNewSize: (newLocalPt, localOrigin, rect) => ({
      width: rect.width,
      height: localOrigin.y - newLocalPt.y,
    }),
    isBaseWidthWhenKeepRatio: () => false,
    getSizeWhenScaleFromCenter: (width, height) => ({
      width: width,
      height: height * 2,
    }),
  },
  [Side.Top + Side.Right]: {
    getLocalOrigin: (_width, height) => ({ x: 0, y: height }),
    getNewSize: (newLocalPt, localOrigin) => ({
      width: newLocalPt.x - localOrigin.x,
      height: localOrigin.y - newLocalPt.y,
    }),
    isBaseWidthWhenKeepRatio: (isWidthLarger: boolean) => isWidthLarger,
    getSizeWhenScaleFromCenter: doubleSize,
  },
  [Side.Right]: {
    getLocalOrigin: (_width, height) => ({ x: 0, y: height / 2 }),
    getNewSize: (newLocalPt, localOrigin, rect) => ({
      width: newLocalPt.x - localOrigin.x,
      height: rect.height,
    }),
    isBaseWidthWhenKeepRatio: () => true,
    getSizeWhenScaleFromCenter: (width, height) => ({
      width: width * 2,
      height: height,
    }),
  },
  [Side.Bottom + Side.Right]: {
    getLocalOrigin: () => ({ x: 0, y: 0 }),
    getNewSize: (newLocalPt, localOrigin) => ({
      width: newLocalPt.x - localOrigin.x,
      height: newLocalPt.y - localOrigin.y,
    }),
    isBaseWidthWhenKeepRatio: (isWidthLarger: boolean) => isWidthLarger,
    getSizeWhenScaleFromCenter: doubleSize,
  },
  [Side.Bottom]: {
    getLocalOrigin: (width) => ({ x: width / 2, y: 0 }),
    getNewSize: (newLocalPt, localOrigin, rect) => ({
      width: rect.width,
      height: newLocalPt.y - localOrigin.y,
    }),
    isBaseWidthWhenKeepRatio: () => false,
    getSizeWhenScaleFromCenter: (width, height) => ({
      width: width,
      height: height * 2,
    }),
  },
  [Side.Bottom + Side.Left]: {
    getLocalOrigin: (width: number) => ({ x: width, y: 0 }),
    getNewSize: (newLocalPt: Point, localOrigin: Point) => ({
      width: localOrigin.x - newLocalPt.x,
      height: newLocalPt.y - localOrigin.y,
    }),
    isBaseWidthWhenKeepRatio: (isWidthLarger: boolean) => isWidthLarger,
    getSizeWhenScaleFromCenter: doubleSize,
  },
  [Side.Left]: {
    getLocalOrigin: (width, height) => ({ x: width, y: height / 2 }),
    getNewSize: (newLocalPt, localOrigin, rect) => ({
      width: localOrigin.x - newLocalPt.x,
      height: rect.height,
    }),
    isBaseWidthWhenKeepRatio: () => true,
    getSizeWhenScaleFromCenter: (width, height) => ({
      width: width * 2,
      height: height,
    }),
  },
};

export const resizeRect = (
  corner: Side,
  newGlobalPt: Point,
  rect: TransformRect,
  options: {
    // keepRatio?: boolean;
    // scaleFromCenter?: boolean;
    noChangeWidthAndHeight?: boolean;
  } = {
    // keepRatio: false,
    // scaleFromCenter: false,
    noChangeWidthAndHeight: false,
  }
): TransformRect => {
  const resizeOp = resizeOps[corner];

  if (!resizeOp) {
    throw new Error("resize corner ${corner} is invalid");
  }

  const transform = new Matrix(...rect.transform);
  const newRect = {
    width: 0,
    height: 0,
    transform: transform.clone(),
  };

  const localOrigin = resizeOp.getLocalOrigin(rect.width, rect.height);

  const newLocalPt = transform.applyInverse(newGlobalPt);
  // console.log("newLocalPt", newLocalPt);

  let size = resizeOp.getNewSize(newLocalPt, localOrigin, rect);

  const scaleTf = new Matrix();

  if (options.noChangeWidthAndHeight) {
    // width 和 height 维持不变，计算缩放比
    scaleTf.scale(size.width / rect.width, size.height / rect.height);
    newRect.width = rect.width;
    newRect.height = rect.height;
  } else {
    // 根据 dw/dh 的正负值判断是否发生翻转
    newRect.width = Math.abs(size.width);
    newRect.height = Math.abs(size.height);
    const scaleX = Math.sign(size.width) || 1;
    const scaleY = Math.sign(size.height) || 1;
    scaleTf.scale(scaleX, scaleY);
  }

  // 应用翻转矩阵
  newRect.transform = newRect.transform.append(scaleTf);

  // 计算位移量
  const newGlobalOrigin = newRect.transform.apply(resizeOp.getLocalOrigin(newRect.width, newRect.height));
  const globalOrigin = transform.apply(localOrigin);

  const offset = {
    x: globalOrigin.x - newGlobalOrigin.x,
    y: globalOrigin.y - newGlobalOrigin.y,
  };

  // 应用位移矩阵
  newRect.transform.prepend(new Matrix().translate(offset.x, offset.y));

  return {
    width: newRect.width,
    height: newRect.height,
    transform: matrixToArray(newRect.transform),
  };
};

// 计算缩放后的 width 和 height
const getTransformedSize = (
  rect: TransformRect
): {
  width: number;
  height: number;
} => {
  // 求的是向量长度，所以 tx 和 ty 要改为 0
  const tf = new Matrix(rect.transform[0], rect.transform[1], rect.transform[2], rect.transform[3], 0, 0);
  const rightTop = tf.apply({ x: rect.width, y: 0 });
  const leftBottom = tf.apply({ x: 0, y: rect.height });
  const zero = { x: 0, y: 0 };
  return {
    width: distance(rightTop, zero),
    height: distance(leftBottom, zero),
  };
};

export const recomputeTransformRect = (rect: TransformRect): TransformRect => {
  const newSize = getTransformedSize(rect);
  const scaleX = newSize.width ? rect.width / newSize.width : 1;
  const scaleY = newSize.height ? rect.height / newSize.height : 1;
  const scaleMatrix = new Matrix().scale(scaleX, scaleY);

  const tf = new Matrix(...rect.transform).append(scaleMatrix);

  return {
    width: newSize.width,
    height: newSize.height,
    transform: matrixToArray(tf),
  };
};

export const distance = (p1: Point, p2: Point) => {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
};

export const matrixToArray = (matrix: Matrix): MatrixArr => {
  return [matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty];
};

export const getInitTransform = ({ x, y }: Point): MatrixArr => {
  return matrixToArray(new Matrix().translate(x, y));
};

// 计算出变换后左上角对应point
export const getTransformedRectPoint = (width: number, height: number, transform: MatrixArr): Point => {
  let point = { x: 0, y: 0 };
  const sX = Math.sign(transform[0]);
  const sY = Math.sign(transform[3]);

  if (sX < 0 && sY > 0) {
    point = new Matrix(...transform).translate(sX * width, 0).apply(point);
  } else if (sX > 0 && sY < 0) {
    point = new Matrix(...transform).translate(0, sY * height).apply(point);
  } else if (sX < 0 && sY < 0) {
    // 找对角
    point = new Matrix(...transform).translate(sX * width, sY * height).apply(point);
  } else {
    point = new Matrix(...transform).apply(point);
  }
  return point;
};
