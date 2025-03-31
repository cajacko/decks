import {
  CardSide,
  CardSize,
  DeckId as Id,
  CardId,
  CardDataId as DataId,
  TabletopId,
  TemplateId,
  TemplateDataId,
  ValidatedValue,
  FieldType,
  TimestampMetadata,
} from "./types";

export type { Id };

export type { DataId };

export interface Card {
  cardId: CardId;
  quantity: number;
}

export type CreateDataSchemaItemHelper<Type extends FieldType = FieldType> = {
  id: DataId;
  type: Type;
  defaultValidatedValue?: ValidatedValue<Type>;
};

export type DataSchemaItem<Type extends FieldType = FieldType> = {
  [K in FieldType]: CreateDataSchemaItemHelper<K>;
}[Type];

export type DataSchema = Record<DataId, DataSchemaItem | undefined>;

type DataTemplateMapItem = {
  /**
   * The key we save the data in the card/ deck
   */
  dataId: DataId;
  /**
   * The key the template uses to render data
   */
  templateDataId: TemplateDataId;
  /**
   * Useful for when the template has a default value set, but we want it to be null. As we wouldn't
   * usually have this null value in deck defaults (why add a data entry that doesn't match how your
   * cards are going to be used), we need a way to override the default value. You may also add
   * defaults here for values you don't want the card to override e.g. background colour or
   * something.
   */
  defaultValidatedValue?: ValidatedValue;
};

export type DataTemplateMapping = Record<
  TemplateDataId,
  DataTemplateMapItem | undefined
>;

export type SideTemplate = {
  templateId: TemplateId;
  dataTemplateMapping: DataTemplateMapping;
};

export type Templates = Record<CardSide, SideTemplate>;

export interface Props extends TimestampMetadata {
  id: Id;
  cards: Card[];
  templates: Templates;
  name: string;
  description: string | null | undefined;
  /**
   * The order in which you want to show the card data in forms. Any missing items will be shown at
   * the end
   */
  dataSchemaOrder?: DataId[];
  /**
   * Define the way you want to store ata about your cards. Using any keys you want. Mapping happens
   * a the template level
   */
  dataSchema: DataSchema;
  defaultTabletopId: TabletopId;
  canEdit: boolean;
  cardSize: CardSize;
  lastScreen?: "deck" | "play";
  sortOrder?: number;
}

export interface State {
  decksById: Record<Id, Props | undefined>;
}
