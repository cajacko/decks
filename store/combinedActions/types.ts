import { Cards, Templates } from "../types";

export type CreateCardDataItemHelper<
  Type extends Templates.FieldType = Templates.FieldType,
> = {
  cardDataId: Cards.DataId;
  fieldType: Type | undefined;
  /**
   * undefined - Delete the value, we want to use the defaults
   * ValidatedValue - A new value to set (which includes a potential null type for when the user
   * wants no value to be used and no fallback)
   */
  validatedValue: Templates.ValidatedValue<Type> | undefined;
};

export type CardDataItem<
  Type extends Templates.FieldType = Templates.FieldType,
> = {
  [K in Type]: CreateCardDataItemHelper<K>;
}[Type];

type TemplateSideMapping = Record<Cards.DataId, Templates.DataId | undefined>;

export type SetCardData = {
  items: CardDataItem[];
  templateMapping: {
    front: TemplateSideMapping;
    back: TemplateSideMapping;
  };
};
