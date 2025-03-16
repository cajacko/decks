// NOTE: All id's need to be safe for urls, they may be visible
const builtInTemplateKey = "default-template";

type BuiltInTemplateKey = typeof builtInTemplateKey;

export const deckTemplateIds = {
  name: "deck.name",
};

// NOTE: Do not change these ID's as people's existing mappings will break
export default function builtInTemplateIds<T extends string>(
  templateIdProp: T,
): {
  templateId: `${BuiltInTemplateKey}-${T}`;
  dataItemId: <D extends string>(
    dataItemId: D,
  ) => `${BuiltInTemplateKey}-${T}-${D}`;
} {
  const templateId: `${BuiltInTemplateKey}-${T}` = `${builtInTemplateKey}-${templateIdProp}`;

  return {
    templateId,
    dataItemId: <D extends string>(
      dataItemId: D,
    ): `${BuiltInTemplateKey}-${T}-${D}` => `${templateId}-${dataItemId}`,
  };
}

// NOTE: Do not change these ID's as people's existing mappings will break
export function exampleDeckIds<T extends string>(
  deckIdProp: T,
): {
  deckId: `example-deck-${T}`;
  tabletopId: string;
  dataItemId: <D extends string>(dataItemId: D) => D;
  stackId: (stackId: string) => string;
  cardId: (cardId: string) => string;
  cardInstanceId: (cardInstanceId: string) => string;
} {
  const deckId: `example-deck-${T}` = `example-deck-${deckIdProp}`;

  return {
    deckId,
    tabletopId: `${deckId}-tabletop`,
    // These are always scoped to the template anyway so can keep simple
    dataItemId: <D extends string>(dataItemId: D): D => dataItemId,
    stackId: (stackId) => `stack-${stackId}`,
    cardId: (cardId) => `${deckId}-card-${cardId}`,
    cardInstanceId: (cardInstanceId) => `cardInstance-${cardInstanceId}`,
  };
}
