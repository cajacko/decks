import * as TemplatesType from "./templates";

export type CardSide = "front" | "back";

export type DeckId = string;
type DataSchemaItemId = string;

export interface Card {
  cardId: string;
  quantity: number;
}

type CreateDataSchemaItemHelper<
  Id extends DataSchemaItemId,
  T extends TemplatesType.DataType = TemplatesType.DataType,
> = {
  id: Id;
  title: string;
  description?: string;
  type: T;
  defaultValue?: TemplatesType.DataValue<T>;
};

type DataSchemaItem<Id extends DataSchemaItemId> = {
  [K in TemplatesType.DataType]: CreateDataSchemaItemHelper<Id, K>;
}[TemplatesType.DataType];

type DataSchema<DsId extends DataSchemaItemId = DataSchemaItemId> = {
  [K in DsId]: DataSchemaItem<K>;
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
  defaultValue?: TemplatesType.DataValue;
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
  description?: string;
  dataSchemaOrder: DsId[];
  dataSchema: DataSchema<DsId>;
}

export interface State {
  decksById: Record<DeckId, Props | undefined>;
}
