import { Values as TemplateValuesMap } from "@/components/Template/Template.types";
import { Cards, Decks, Templates } from "@/store/types";

export type { TemplateValuesMap };

export type TargetOrigin = "card" | "deck-defaults";

export type FallbackValueOrigin =
  | Exclude<TargetOrigin, "card">
  | "template"
  | "template-map";

export type EditingValueOrigin = "editing";

export type ValueOrigin =
  | FallbackValueOrigin
  | EditingValueOrigin
  | TargetOrigin;

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
  /**
   * The level at which we're setting data. This helps us figure out what level of fallback to use
   */
  targetOrigin: TargetOrigin | null;
  deckDataSchema: Decks.DataSchema | null;
  cardData: Cards.Data | null;
  templates: Record<Cards.Side, TemplateSide | null> | null;
  // If this changes we reset the state
  resetId?: string;
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
  updateProps: (
    props: ResolveCardDataProps | null,
    options?: { reset?: boolean },
  ) => ResolvedCardData;
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
  /**
   * The value we show the user and on the card (this could be a value we are editing)
   */
  resolvedValidatedValue: undefined | ValidatedValue<ValueOrigin, Type>;
  // /**
  //  * The value we are currently editing (if any)
  //  */
  // editingValidatedValue: undefined | Templates.ValidatedValue<Type>;
  /**
   * The value saved on this target
   */
  savedValidatedValue: undefined | ValidatedValue<TargetOrigin, Type>;
  /**
   * The value we would fallback to if there's no values saved on this target
   * Remember a target could be something like the card or the deck default.
   * We need to know this for when a user indicates they want to use the fallback value
   */
  fallbackValidatedValue: undefined | ValidatedValue<FallbackValueOrigin, Type>;
};

export type DataItem<Type extends Templates.FieldType = Templates.FieldType> = {
  [K in Templates.FieldType]: CreateDataItemHelper<K>;
}[Type];

export interface ResolvedCardData {
  targetOrigin: TargetOrigin | null;
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
  _debugCount: number;
}
