import { useEffect, useState } from "react";
import { useColorScheme as useRNColorScheme } from "react-native";
import { useAppSelector } from "@/store/hooks";
import { selectUserSetting } from "@/store/slices/userSettings";

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export default function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const system = useRNColorScheme();

  const colorScheme =
    useAppSelector((state) => selectUserSetting(state, { key: "theme" })) ??
    "system";

  if (hasHydrated) {
    if (colorScheme === "system") {
      if (!system) return "dark";

      return system;
    }

    return colorScheme;
  }

  return "dark";
}
