/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */
import { themes, ThemeObjectKey, ThemeObjectValue } from "@/constants/colors";
import useColorScheme from "@/hooks/useColorScheme";
import Color from "color";

export function useThemeColors() {
  const theme = useColorScheme();

  return themes[theme];
}

export function useThemeColor<K extends ThemeObjectKey>(
  colorName: K,
  options?: {
    opacity?: number;
  },
): ThemeObjectValue<K> {
  const colors = useThemeColors();
  const color: ThemeObjectValue<K> = colors[colorName];

  if (!options?.opacity) {
    return color;
  }

  return Color(color).alpha(options.opacity).rgb().string();
}
