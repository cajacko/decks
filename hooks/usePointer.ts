import React from "react";
import { getMousePosition } from "@/utils/mousePosition";

export default function usePointer() {
  const getIsPointerOverRef = React.useCallback(
    <T>(ref: React.RefObject<T>): boolean => {
      if (typeof HTMLElement === "undefined" || !HTMLElement) return false;

      const element = ref.current;

      if (!element) {
        return false;
      }

      if (!(element instanceof HTMLElement)) {
        return false;
      }

      const mousePosition = getMousePosition();

      if (!mousePosition) return false;

      const rect = element.getBoundingClientRect();
      const { x, y } = mousePosition;

      const isOver =
        x >= rect.x &&
        x <= rect.x + rect.width &&
        y >= rect.y &&
        y <= rect.y + rect.height;

      return isOver;
    },
    [],
  );

  return {
    getIsPointerOverRef,
  };
}
