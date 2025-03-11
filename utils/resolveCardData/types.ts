import { Values as TemplateValuesMap } from "@/components/Template/Template.types";
import { Cards, Decks, Templates } from "@/store/types";

export type { TemplateValuesMap };

type SavedValueOrigin = "card" | "deck" | "template" | "template-map";
type EditingValueOrigin = "editing";

export type ValueOrigin = SavedValueOrigin | EditingValueOrigin;

export type ValidatedValue<
  Origin extends ValueOrigin = ValueOrigin,
  Type extends Templates.FieldType = Templates.FieldType,
> = Templates.ValidatedValue<Type> & {
  origin: Origin;
};

export interface TemplateSide {
  schema: Templates.Data | null;
  dataTemplateMapping: Decks.DataTemplateMapping | null;
}

export type EditingData = Record<
  Cards.DataId,
  Templates.ValidatedValue | undefined
>;

export interface ResolveCardDataProps {
  deckDataSchema: Decks.DataSchema | null;
  cardData: Cards.Data | null;
  templates: Record<Cards.Side, TemplateSide | null> | null;
}

export interface UpdatedDataItem {
  templateDataId: Templates.DataId;
  side: Cards.Side;
  validatedValue: Templates.ValidatedValue | undefined;
}

export type UpdateEditingDataItem = (
  props: UpdatedDataItem,
) => ResolvedCardData;

export interface WithResolveCardDataReturn {
  updateProps: (props: ResolveCardDataProps | null) => ResolvedCardData;
  updateEditingDataItem: UpdateEditingDataItem;
  getResolvedCardData: () => ResolvedCardData;
}

export type WithResolveCardData = (
  initialProps: ResolveCardDataProps | null,
) => WithResolveCardDataReturn;

export type CreateDataItemHelper<
  Type extends Templates.FieldType = Templates.FieldType,
> = {
  dataId: Cards.DataId;
  fieldType: Type | null;
  resolvedValidatedValue: undefined | ValidatedValue<ValueOrigin, Type>;
  editingValidatedValue: undefined | Templates.ValidatedValue<Type>;
  savedValidatedValue: undefined | ValidatedValue<SavedValueOrigin, Type>;
};

export type DataItem<Type extends Templates.FieldType = Templates.FieldType> = {
  [K in Templates.FieldType]: CreateDataItemHelper<K>;
}[Type];

type TemplateHasChanges = {
  any: boolean;
  byTemplateDataId: Record<Templates.DataId, boolean | undefined>;
};

export interface ResolvedCardData {
  /**
   * For the CardTemplate component to use and display values on a card
   */
  resolvedDataValues: Record<Cards.Side, TemplateValuesMap>;
  dataByCardDataId: Record<
    Cards.Side,
    Record<Cards.DataId, DataItem | undefined>
  >;
  dataIdByTemplateDataId: Record<
    Cards.Side,
    Record<Templates.DataId, Cards.DataId | undefined>
  >;
  hasChanges: null | {
    either: boolean;
    front: TemplateHasChanges | null;
    back: TemplateHasChanges | null;
  };
  _debugCount: number;
}
