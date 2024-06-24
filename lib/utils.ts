import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import { Camera } from "@/types/canvas"

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

export function pointerEventToCanvasPoint(e: React.PointerEvent, camera: Camera) {
  return {
    x: Math.round(e.clientX) - camera.x,
    y: Math.round(e.clientY) - camera.y
  }
}