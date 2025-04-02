import useColorScheme from "@/hooks/useColorScheme";

const logoDark = require("../assets/images/text-logo-dark.png");
const logoLight = require("../assets/images/text-logo-light.png");

export function useTextLogo() {
  const colorScheme = useColorScheme();

  return {
    source: colorScheme === "dark" ? logoDark : logoLight,
    aspectRatio: 300 / 166,
  };
}
