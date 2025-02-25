import { Decks, Templates } from "@/store/types";
import { WritableDraft } from "immer";

export type PartialDataValue<
  T extends Templates.DataType = Templates.DataType,
> = {
  [K in T]: {
    type: Templates.ValidatedValue<K>["type"];
    value?: Templates.ValidatedValue<K>["value"];
  };
}[T];

type LooseEditingDataValues<T extends Templates.DataType = Templates.DataType> =
  {
    templateId: Templates.TemplateId;
    templateItemId: Templates.DataItemId;
    cardDataItemId: Decks.DataSchemaItemId | null;
    type: Templates.ValidatedValue<T>["type"];
    savedValue: Templates.ValidatedValue<T>["value"] | null;
    editValue: Templates.ValidatedValue<T>["value"] | null;
  };

export type EditingDataValues<
  T extends Templates.DataType = Templates.DataType,
> = {
  [K in T]: LooseEditingDataValues<K>;
}[T];

export type EditDataValueMap = Record<
  string,
  LooseEditingDataValues | undefined
>;

export interface EditCardState {
  cardId: string;
  deckId: string;
  front: EditDataValueMap;
  back: EditDataValueMap;
  hasChanges: {
    front: Record<string, boolean | undefined>;
    back: Record<string, boolean | undefined>;
  };
  getContextState: () => EditCardState;
}

export type EditState = (
  recipe: (draft: WritableDraft<EditCardState>) => void,
) => void;

export interface EditCardContext {
  state: EditCardState;
  editState: EditState;
}
