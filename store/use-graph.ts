import { create } from "zustand";

interface IGraphStore {
  graphColor: string;
  setGraphColor: (color: string) => void;
}

export const useGraphStore = create<IGraphStore>((set) => ({
  graphColor: "#fff",
  setGraphColor: (color) => {
    set({
      graphColor: color,
    });
  },
}));
