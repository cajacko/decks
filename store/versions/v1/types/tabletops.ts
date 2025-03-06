import { History as CreateHistoryHelper } from "./helpers";
import * as Cards from "./cards";
import * as Decks from "./decks";

export type TabletopId = string;
export type StackId = string;
export type CardInstanceId = string;

export enum MoveCardInstanceMethod {
  topFaceUp = "topFaceUp",
  topFaceDown = "topFaceDown",
  topNoChange = "topNoChange",
  bottomFaceUp = "bottomFaceUp",
  bottomFaceDown = "bottomFaceDown",
  bottomNoChange = "bottomNoChange",
}

export interface CardInstance {
  cardInstanceId: CardInstanceId;
  cardId: Cards.CardId;
  side: Cards.Side;
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

export interface Props {
  id: TabletopId;
  availableDecks: Decks.DeckId[];
  history: History;
}

export interface State {
  tabletopsById: Record<TabletopId, Props | undefined>;
}
