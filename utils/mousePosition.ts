let mousePosition: { x: number; y: number } | null = null;

export function getMousePosition() {
  return mousePosition;
}

function handleMouseMove(event: MouseEvent) {
  mousePosition = { x: event.clientX, y: event.clientY };
}

export function init() {
  if (typeof window === "undefined" || !window) {
    return () => undefined;
  }

  window.addEventListener?.("mousemove", handleMouseMove);

  return () => {
    window.removeEventListener?.("mousemove", handleMouseMove);
  };
}
