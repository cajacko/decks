import { useContextSelector } from "./useContextSelector";

export default function useIsNewCard(): boolean | null {
  const target = useContextSelector((context) => context?.state?.target);

  // If there's no target, then we can't be a new card
  if (!target) return null;

  return target?.type === "new-card-in-deck";
}
