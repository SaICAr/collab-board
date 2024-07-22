import { create } from "zustand";

interface IGraphStore {
  graphColor: string;
  penColor: string;
  textColor: string;
  setGraphColor: (color: string) => void;
  setPenColor: (color: string) => void;
  setTextColor: (color: string) => void;
}

export const useGraphStore = create<IGraphStore>((set) => ({
  graphColor: "#fff",
  penColor: "#000",
  textColor: "#000",
  setGraphColor: (color) => {
    set({
      graphColor: color,
    });
  },
  setPenColor: (color) => {
    set({
      penColor: color,
    });
  },
  setTextColor: (color) => {
    set({
      textColor: color,
    });
  },
}));
