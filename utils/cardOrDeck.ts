type CardOrDeckType = "deck" | "card";

export type CardOrDeckId<T extends CardOrDeckType = CardOrDeckType> = {
  targetId: string;
  targetType: T;
};

export function getIsDeckId(id: CardOrDeckId): id is CardOrDeckId<"deck"> {
  return id.targetType === "deck";
}

export function getIsCardId(id: CardOrDeckId): id is CardOrDeckId<"card"> {
  return id.targetType === "card";
}

export function getIsSameId(a: CardOrDeckId, b: CardOrDeckId): boolean {
  if (a.targetId !== b.targetId) return false;

  return a.targetType === b.targetType;
}
