import * as TemplatesType from "./templates";

export type CardSide = "front" | "back";

export type DeckId = string;
export type DataSchemaItemId = string;

export enum CardSize {
  Poker = "poker",
}

export interface Card {
  cardId: string;
  quantity: number;
}

type CreateDataSchemaItemHelper<
  Id extends DataSchemaItemId,
  T extends TemplatesType.DataType = TemplatesType.DataType,
> = {
  id: Id;
  // title?: string;
  // description?: string;
  type: T;
  defaultValidatedValue?: TemplatesType.ValidatedValue<T>;
};

export type DataSchemaItem<Id extends DataSchemaItemId = DataSchemaItemId> = {
  [K in TemplatesType.DataType]: CreateDataSchemaItemHelper<Id, K>;
}[TemplatesType.DataType];

export type LooseDataSchemaItem = CreateDataSchemaItemHelper<DataSchemaItemId>;

export type DataSchema<DsId extends DataSchemaItemId = DataSchemaItemId> = {
  [K in DsId]: DataSchemaItem<K> | undefined;
};

type DataTemplateMapItem = {
  /**
   * The key we save the data in the card/ deck
   */
  dataSchemaItemId: DataSchemaItemId;
  /**
   * The key the template uses to render data
   */
  templateSchemaItemId: TemplatesType.DataItemId;
  defaultValidatedValue?: TemplatesType.ValidatedValue;
};

export type DataTemplateMapping = Record<
  TemplatesType.DataItemId,
  DataTemplateMapItem | undefined
>;

export type SideTemplate = {
  templateId: string;
  dataTemplateMapping: DataTemplateMapping;
};

export type Templates = Record<CardSide, SideTemplate>;

export interface Props<DsId extends DataSchemaItemId = DataSchemaItemId> {
  id: DeckId;
  cards: Card[];
  templates: Templates;
  name: string;
  description: string | null | undefined;
  dataSchemaOrder: DsId[];
  dataSchema: DataSchema<DsId>;
  defaultTabletopId: string;
  status: "creating" | "active" | "deleting";
  canEdit: boolean;
  cardSize: CardSize;
  lastScreen?: "deck" | "play";
}

export interface State {
  decksById: Record<DeckId, Props | undefined>;
  deckIds: DeckId[];
}
