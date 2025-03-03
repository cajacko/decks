import text from "@/config/text";

export default function deckNameWithFallback(deckName?: string | null): string {
  let name = deckName?.trim();

  return name || text["deck.name.unnamed"];
}
