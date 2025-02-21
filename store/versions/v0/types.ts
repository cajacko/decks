import { Patch } from "immer";

export interface Patches {
  patches: Patch[];
  inversePatches: Patch[];
}

export interface History<S = unknown> {
  past: Patches[];
  present: S;
  future: Patches[];
}

// TODO: Where are styles defined, deck, card, both? What happens when a card is in multiple decks?
export interface Card {
  cardId: string;
}

export interface CardsState {
  cardsById: Record<string, Card | undefined>;
}

export interface DeckCard {
  cardId: string;
  quantity: number;
}

export interface Deck {
  id: string;
  deckCards: DeckCard[];
}

export interface DecksState {
  decksById: Record<string, Deck | undefined>;
}

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
  cardInstanceId: string;
  cardId: string;
  state: CardInstanceState;
}

export interface Stack {
  id: string;
  cardInstances: string[];
}

export interface TabletopHistoryState {
  stacksIds: string[];
  stacksById: Record<string, Stack | undefined>;
  cardInstancesById: Record<string, CardInstance | undefined>;
}

export type TabletopHistory = History<TabletopHistoryState>;

export interface Tabletop {
  id: string;
  stacksIds: string[];
  history: TabletopHistory;
}

export interface TabletopState {
  tabletopsById: Record<string, Tabletop | undefined>;
}

export interface UserSettingsState {
  animateCardMovement: boolean;
  holdMenuBehaviour: "hold" | "tap";
}

export enum SliceName {
  UserSettings = "userSettings",
  Decks = "decks",
  Tabletops = "tabletops",
  Cards = "cards",
}

export interface RootState {
  [SliceName.UserSettings]: UserSettingsState;
  [SliceName.Decks]: DecksState;
  [SliceName.Tabletops]: TabletopState;
  [SliceName.Cards]: CardsState;
}
