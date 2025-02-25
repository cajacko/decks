import { History as CreateHistoryHelper } from "./helpers";
import * as Cards from "./cards";

type TabletopId = string;
type StackId = string;
export type CardInstanceId = string;

export enum MoveCardInstanceMethod {
  topFaceUp = "topFaceUp",
  topFaceDown = "topFaceDown",
  topNoChange = "topNoChange",
  bottomFaceUp = "bottomFaceUp",
  bottomFaceDown = "bottomFaceDown",
  bottomNoChange = "bottomNoChange",
}

export enum CardInstanceState {
  faceDown = "faceDown",
  faceUp = "faceUp",
}

export interface CardInstance {
  cardInstanceId: CardInstanceId;
  cardId: Cards.CardId;
  state: CardInstanceState;
}

export interface Stack {
  id: StackId;
  cardInstances: CardInstanceId[];
}

export interface HistoryState {
  stacksIds: StackId[];
  stacksById: Record<StackId, Stack | undefined>;
  cardInstancesById: Record<CardInstanceId, CardInstance | undefined>;
}

type History = CreateHistoryHelper<HistoryState>;

export interface Props {
  id: TabletopId;
  stacksIds: StackId[];
  history: History;
}

export interface State {
  tabletopsById: Record<TabletopId, Props | undefined>;
}
