import * as TemplatesType from "./templates";
import * as Decks from "./decks";
import { SideTemplate, CardSide as Side, DataTemplateMapping } from "./decks";

// Re-export types that also make semantic sense as part of the cards module
export { Side, SideTemplate, DataTemplateMapping };

export type CardId = string;

export type Data = Record<string, TemplatesType.ValidatedValue | undefined>;

export interface Props {
  cardId: CardId;
  deckId: Decks.DeckId | null;
  data: Data;
  templates?: Partial<Decks.Templates>;
  status: "creating" | "active" | "deleting";
}

export interface State {
  cardsById: Record<CardId, Props | undefined>;
}
