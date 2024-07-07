export type Color = {
  r: number;
  g: number;
  b: number;
};

export type Camera = {
  x: number;
  y: number;
};

export enum LayerType {
  Rectangle, // 矩形
  Ellipse, // 椭圆
  Path, // 画笔
  Text, // 文本
  Note, // 便签
}

export type RectangleLayer = {
  type: LayerType.Rectangle;
  x: number;
  y: number;
  height: number;
  width: number;
  fill: Color;
  value?: string;
};

export type EllipseLayer = {
  type: LayerType.Ellipse;
  x: number;
  y: number;
  height: number;
  width: number;
  fill: Color;
  value?: string;
};

export type PathLayer = {
  type: LayerType.Path;
  x: number;
  y: number;
  height: number;
  width: number;
  fill: Color;
  points: number[][];
  value?: string;
};

export type TextLayer = {
  type: LayerType.Text;
  x: number;
  y: number;
  height: number;
  width: number;
  fill: Color;
  value?: string;
};

export type NoteLayer = {
  type: LayerType.Note;
  x: number;
  y: number;
  height: number;
  width: number;
  fill: Color;
  value?: string;
};

export type Point = {
  x: number;
  y: number;
};

// 用来表示坐标和大小
export type XYWH = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export enum Side {
  Top = 1,
  Bottom = 2,
  Left = 4,
  Right = 8,
}

export enum CanvasMode {
  None, // 初始状态
  Pressing, // 选中某个元素
  SelectionNet, // 移动元素
  Translating, // 转换元素
  Inserting, // 插入元素，适用于文本、矩形、圆形、便签
  Resizing, // 调整大小
  Pencil, // 绘画
}

export type CanvasState =
  | { mode: CanvasMode.None }
  | { mode: CanvasMode.Pressing; origin: Point }
  | { mode: CanvasMode.Translating; current: Point }
  | { mode: CanvasMode.SelectionNet; origin: Point; current?: Point }
  | {
      mode: CanvasMode.Inserting;
      layerType: LayerType.Rectangle | LayerType.Ellipse | LayerType.Note | LayerType.Text;
    }
  | { mode: CanvasMode.Resizing; initialBounds: XYWH; corner: Side }
  | { mode: CanvasMode.Pencil };

export type Layer = RectangleLayer | EllipseLayer | PathLayer | TextLayer | NoteLayer;
