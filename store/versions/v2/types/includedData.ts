// NOTE: This is in redux, so any breaking changes needs a new version, additive changes are fine
// Avoid booleans, unless it's a feature toggle, prefer strings. Otherwise if we change a feature
// from boolean to having some different states we may miss some conditional checks that were just
// doing a truthy check.

import { DateString } from "./types";

export type Value = string | boolean | undefined | null;

export type Row = Record<string, Value>;

export type Item<P = Row, D = Row> = {
  props: P;
  data: D[] | null;
};

export type Data<I extends Item<unknown, unknown> = Item<Row, Row>> = I[];

export type Card = {
  title?: string;
  description?: string;
  emoji?: string;
  devOnly?: boolean;
};

export type DeckProps = {
  title: string;
  description: string;
  version?: string;
  devOnly?: boolean;
  gid?: string;
  key: string;
  color?: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  backTextSize?: string;
  sortOrder?: string;
  emojiSize?: string;
};

export type Deck = Item<DeckProps, Card>;
export type Decks = Data<Deck>;

export interface State {
  data: Data;
  dateFetched: DateString | null;
}
