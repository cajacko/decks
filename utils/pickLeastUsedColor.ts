export default function pickLeastUsedColor({
  availableColors,
  usedColors,
  fallback,
}: {
  usedColors: string[];
  availableColors: string[];
  fallback: string;
}): string {
  if (availableColors.length === 0) {
    return fallback;
  }

  // Count occurrences of each color in usedColors
  const colorUsageMap = new Map<string, number>();

  availableColors.forEach((color) => {
    colorUsageMap.set(color, 0);
  });

  usedColors.forEach((color) => {
    if (colorUsageMap.has(color)) {
      colorUsageMap.set(color, (colorUsageMap.get(color) ?? 0) + 1);
    }
  });

  // Find the color with the lowest usage count
  return availableColors.reduce((leastUsed, color) =>
    colorUsageMap.get(color)! < colorUsageMap.get(leastUsed)!
      ? color
      : leastUsed,
  );
}
