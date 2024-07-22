import { create } from "zustand";

interface IPencilStore {
  pencilColor: string;
  pencilSize: number;

  setPencilColor: (color: string) => void;
  setPencilSize: (size: number) => void;
}

export const usePencilStore = create<IPencilStore>((set) => ({
  pencilColor: "#000",
  pencilSize: 8,
  setPencilColor: (color) => {
    set({
      pencilColor: color,
    });
  },
  setPencilSize: (size) => {
    set({
      pencilSize: size,
    });
  },
}));
