import { ReservedDataSchemaIds } from "@/constants/reservedDataSchemaItems";

export type ReservedCardData = {
  [K in ReservedDataSchemaIds]?: string;
};

// NOTE: Whatever key/ values are present in ExampleCard are used as the data ids so you will want
// to match these with the template. You can use other keys as well, just match these with what's in
// the template you are using
export interface ExampleDeck<CardData extends object = ReservedCardData> {
  name: string;
  description: string;
  frontTemplateId: string;
  backTemplateId: string;
  cards: CardData[];
}
