import { History as CreateHistoryHelper } from "./helpers";
import {
  CardInstanceId,
  StackId,
  TabletopId as Id,
  CardSide,
  CardId,
  DeckId,
} from "./types";

export type { CardInstanceId, StackId, Id };

export interface CardInstance {
  cardInstanceId: CardInstanceId;
  cardId: CardId;
  side: CardSide;
}

export interface Stack {
  id: StackId;
  cardInstances: CardInstanceId[];
}

export type CardInstancesById = Record<
  CardInstanceId,
  CardInstance | undefined
>;

export type StacksById = Record<StackId, Stack | undefined>;

export interface HistoryState {
  stacksIds: StackId[];
  stacksById: StacksById;
  cardInstancesById: CardInstancesById;
}

type History = CreateHistoryHelper<HistoryState>;

/**
 * Settings the user can change for this specific tabletop
 */
export interface Settings {
  preferNeatStacks?: boolean;
  defaultCardSide?: CardSide;
  /**
   * Store the number the user sees (so not 0 indexed)
   */
  newCardsJoinStackNumber?: number;
  newCardsGoToTopOfStack?: boolean;
  doNotAddNewCardsAutomatically?: boolean;
}

export interface Props {
  id: Id;
  availableDecks: DeckId[];
  history: History;
  // Undefined forces us to make a decision of what value to set here in our builders for example
  // decks etc
  settings: Settings | undefined;
  missingCardIds: CardId[] | undefined;
}

export interface State {
  tabletopsById: Record<Id, Props | undefined>;
}
