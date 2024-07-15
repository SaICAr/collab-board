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
  Image, // 自定义图片
}

type BaseLayer<T> = {
  type: T;
  x: number;
  y: number;
  height: number;
  width: number;
  fill?: Color;
  value?: string;
};

export type RectangleLayer = BaseLayer<LayerType.Rectangle>;
export type EllipseLayer = BaseLayer<LayerType.Ellipse>;
export type TextLayer = BaseLayer<LayerType.Text>;
export type NoteLayer = BaseLayer<LayerType.Note>;
export type ImageLayer = BaseLayer<LayerType.Image>;
export type PathLayer = BaseLayer<LayerType.Path> & {
  points: number[][];
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
  SelectionNet, // 选中（多选）元素
  Translating, // 移动选中元素
  Inserting, // 插入元素
  Resizing, // 调整大小
  Pencil, // 绘画
  Typing, // 打字状态
}

export type CanvasState =
  | { mode: CanvasMode.None }
  | { mode: CanvasMode.Typing }
  | { mode: CanvasMode.Pressing; origin: Point }
  | { mode: CanvasMode.Translating; current: Point }
  | { mode: CanvasMode.SelectionNet; origin: Point; current?: Point }
  | {
      mode: CanvasMode.Inserting;
      layerType: InsertableLayerType;
      origin?: Point;
      current?: Point;
    }
  | { mode: CanvasMode.Resizing; initialBounds: XYWH; corner: Side }
  | { mode: CanvasMode.Pencil };

export type Layer = RectangleLayer | EllipseLayer | PathLayer | TextLayer | NoteLayer | ImageLayer;

export type InsertableLayer = EllipseLayer | NoteLayer | RectangleLayer | TextLayer | ImageLayer;

export type InsertableLayerType =
  | LayerType.Rectangle
  | LayerType.Ellipse
  | LayerType.Note
  | LayerType.Text
  | LayerType.Image;
