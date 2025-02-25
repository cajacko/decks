import { useRequiredContextSelector } from "./useContextSelector";

export default function useIsNewCard() {
  return useRequiredContextSelector(
    (context): boolean => !!context && "deckId" in context.state.cardOrDeckId,
  );
}
