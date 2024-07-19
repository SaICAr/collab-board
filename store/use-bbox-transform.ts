import { matrixToArray } from "@/lib/utils";
import { MatrixArr } from "@/types/canvas";
import { Matrix } from "pixi.js";
import { create } from "zustand";

interface IBboxTransform {
  transform: MatrixArr;
  setTransform: (transform: MatrixArr) => void;
}

const defaultTransform = matrixToArray(new Matrix());

export const useBboxTransform = create<IBboxTransform>((set) => ({
  transform: defaultTransform,
  setTransform: (transform) => {
    set({
      transform,
    });
  },
}));
