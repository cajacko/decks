import { SideTemplate, DataTemplateMapping, Templates } from "./decks";
import {
  DeckId,
  CardDataId as DataId,
  CardSide as Side,
  CardId as Id,
  CardSize as Size,
  ValidatedValue,
} from "./types";

export { Side, SideTemplate, DataTemplateMapping, Id, Size, DataId };

export type Data = Record<DataId, ValidatedValue | undefined>;

export interface Props {
  cardId: Id;
  canEdit: boolean;
  deckId: DeckId | null;
  data: Data;
  size: Size | null;
  /**
   * Advanced override for when an individual card has a different template from all the others.
   * Usually it's best to create multiple decks and combine them in collections, or use templates
   * that are flexible enough to handle all the data you need. But there can be use cases for this
   * e.g. when you have a single different card in a deck, where creating a whole new deck for that
   * one card would be overkill.
   */
  templates?: Partial<Templates>;
  status: "creating" | "active" | "deleting";
}

export interface State {
  cardsById: Record<Id, Props | undefined>;
}
