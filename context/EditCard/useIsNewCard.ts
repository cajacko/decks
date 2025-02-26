import { useRequiredContextSelector } from "./useContextSelector";

export default function useIsNewCard(): boolean {
  return (
    useRequiredContextSelector((context) => context?.state.targetType) ===
    "deck"
  );
}
