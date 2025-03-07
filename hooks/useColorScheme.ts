import { useColorScheme as _useColorScheme } from "react-native";
import { useAppSelector } from "@/store/hooks";
import { selectUserSetting } from "@/store/slices/userSettings";

export default function useColorScheme(): "light" | "dark" {
  const system = _useColorScheme();

  const colorScheme =
    useAppSelector((state) => selectUserSetting(state, { key: "theme" })) ??
    "system";

  if (colorScheme === "system") {
    if (!system) return "dark";

    return system;
  }

  return colorScheme;
}
