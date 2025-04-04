import { ReservedDataSchemaIds } from "@/constants/reservedDataSchemaItems";
import { Decks, Tabletops } from "@/store/types";

export type ReservedCardData = {
  [K in ReservedDataSchemaIds]?: string | null;
};

export type ExampleCardData = ReservedCardData & {
  emoji?: string;
  devOnly?: boolean;
};

// NOTE: Whatever key/ values are present in ExampleCard are used as the data ids so you will want
// to match these with the template. You can use other keys as well, just match these with what's in
// the template you are using
export interface ExampleDeck<
  CardData extends ExampleCardData = ExampleCardData,
> {
  name: string;
  description: string;
  cards: (CardData & ExampleCardData)[];
  templates: Decks.Templates;
  dataSchema?: Decks.DataSchema;
  tabletopSettings?: Tabletops.Settings;
  devOnly: boolean;
  sortOrder: number | null;
  version: string | null;
}
