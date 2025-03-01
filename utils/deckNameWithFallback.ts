export default function deckNameWithFallback(deckName?: string | null): string {
  let name = deckName?.trim();

  return name || `Unnamed Deck`;
}
