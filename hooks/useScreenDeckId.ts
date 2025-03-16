import { useLocalSearchParams, useGlobalSearchParams } from "expo-router";
import AppError from "@/classes/AppError";
import { useNavigation } from "expo-router";

export const paramKeys = {
  deckId: "deckId",
};

export default function useScreenDeckId(
  type: "screen" | "layout",
  logErrorComponentName: string | null,
): string | null {
  const localParams = useLocalSearchParams();
  const globalParams = useGlobalSearchParams();

  // For the layout getting the global search ones are key here. We had an issue when navigating
  // between decks where the local search params would retain the previous deckId, adding this and
  // the href props in the navOptions fixed the issue
  // Otherwise for screens we want to use the local params, as this ensures expo router can render
  // non active screens in the background properly, otherwise those screens would use the global
  // params not the one you want to prerender
  const params = type === "screen" ? localParams : globalParams;
  const fallbackParams = type === "screen" ? globalParams : localParams;

  const deckIdParam = params[paramKeys.deckId];
  const deckId = typeof deckIdParam === "string" ? deckIdParam : null;
  const navigation = useNavigation();

  if (!deckId) {
    if (type === "screen" && logErrorComponentName && navigation.isFocused()) {
      new AppError(`${logErrorComponentName}: deckId must be a string`).log(
        "error",
      );
    }

    // globalParams is a fallback
    const fallbackDeckId = fallbackParams[paramKeys.deckId];

    if (typeof fallbackDeckId === "string") {
      return fallbackDeckId;
    }

    return null;
  }

  return deckId;
}
