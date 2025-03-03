/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */
import { themes } from "@/constants/colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import Color from "color";

export function useThemeColors() {
  const theme = useColorScheme() ?? "light";

  return themes[theme];
}

export function useThemeColor(
  colorName: keyof typeof themes.light & keyof typeof themes.dark,
  options?: {
    opacity?: number;
  },
) {
  const colors = useThemeColors();
  const color = colors[colorName];

  if (!options?.opacity) {
    return color;
  }

  return Color(color).alpha(options.opacity).rgb().string();
}
