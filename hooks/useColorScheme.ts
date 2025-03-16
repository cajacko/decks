import { useColorScheme as _useColorScheme } from "react-native";
import { useAppSelector } from "@/store/hooks";
import { selectUserSetting } from "@/store/slices/userSettings";

// Default to dark because we like that better
export const defaultTheme = "dark";

export default function useColorScheme(): "light" | "dark" {
  const system = _useColorScheme();

  const colorScheme =
    useAppSelector((state) => selectUserSetting(state, { key: "theme" })) ??
    defaultTheme;

  if (colorScheme === "system") {
    if (!system) return "dark";

    return system;
  }

  return colorScheme;
}
