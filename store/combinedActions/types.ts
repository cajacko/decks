import { Cards, Templates } from "../types";

export type CreateCardDataItemHelper<
  Type extends Templates.FieldType = Templates.FieldType,
> = {
  cardDataId: Cards.DataId;
  fieldType: Type;
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
