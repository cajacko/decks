type TargetType = "new-card-in-deck" | "card" | "deck-defaults";

export type Target<T extends TargetType = TargetType> = {
  id: string;
  type: T;
};

export function getIsDeckId(id: Target): id is Target<"new-card-in-deck"> {
  return id.type === "new-card-in-deck";
}

export function getIsCardId(id: Target): id is Target<"card"> {
  return id.type === "card";
}

export function getIsSameTarget(a: Target, b: Target): boolean {
  if (a.id !== b.id) return false;

  return a.type === b.type;
}
