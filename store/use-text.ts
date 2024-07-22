import { create } from "zustand";

interface ITextStore {
  textColor: string;
  setTextColor: (color: string) => void;
}

export const useTextStore = create<ITextStore>((set) => ({
  textColor: "#000",
  setTextColor: (color) => {
    set({
      textColor: color,
    });
  },
}));
