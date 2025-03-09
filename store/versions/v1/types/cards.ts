import * as TemplatesType from "./templates";
import * as Decks from "./decks";
import { SideTemplate, CardSide as Side, DataTemplateMapping } from "./decks";

// Re-export types that also make semantic sense as part of the cards module
export { Side, SideTemplate, DataTemplateMapping };

export type CardId = string;

export type Data = Record<string, TemplatesType.ValidatedValue | undefined>;

export interface Props {
  cardId: CardId;
  canEdit: boolean;
  deckId: Decks.DeckId | null;
  data: Data;
  /**
   * Advanced override for when an individual card has a different template from all the others.
   * Usually it's best to create multiple decks and combine them in collections, or use templates
   * that are flexible enough to handle all the data you need. But there can be use cases for this
   * e.g. when you have a single different card in a deck, where creating a whole new deck for that
   * one card would be overkill.
   */
  templates?: Partial<Decks.Templates>;
  status: "creating" | "active" | "deleting";
}

export interface State {
  cardsById: Record<CardId, Props | undefined>;
}
