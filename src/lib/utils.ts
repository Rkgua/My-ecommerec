// 存放项目中通用的、非 UI 相关的 JavaScript/TypeScript 工具函数。
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
