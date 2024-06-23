import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

const COLORS = [
  "#D97706",
  "#059669",
  "#7C3AED",
  "#DB2777",
  "#DC2626",
]

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function connectionIdToColor(connectionId: number):string {
  return COLORS[connectionId % COLORS.length]
}
