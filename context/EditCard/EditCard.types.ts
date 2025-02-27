import React from "react";
import { Cards, Decks, Templates } from "@/store/types";
import { WritableDraft } from "immer";
import { Target } from "@/utils/cardTarget";

export type OnCreateCard = (cardId: string) => void;
export type OnChangeTarget = (target: Target | null) => void;

export type EditCardProviderProps = {
  /**
   * null - When you want the context children to decide what the target is dynamically
   * type = "deck" - when you want to create a new card in a deck
   * type = "card" - when you want to edit an existing card
   */
  target: Target | null;
  side?: Cards.Side;
  onChangeSide?: (side: Cards.Side) => void;
  children?: React.ReactNode;
  onCreateCard?: OnCreateCard | null;
  onChangeTarget?: OnChangeTarget | null;
};

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

export type HasSideChanges = Record<string, boolean | undefined>;
export type HasChangesMap = Record<Cards.Side, HasSideChanges>;

export type EditCardState = {
  target: Target;
  front: EditDataValueMap;
  back: EditDataValueMap;
  hasChanges: HasChangesMap;
  getContextState: () => EditCardState;
};

export type EditDraftRecipe = (draft: WritableDraft<EditCardState>) => void;

export type EditState = (recipe: EditDraftRecipe) => void;

export type SetTarget = React.Dispatch<React.SetStateAction<Target | null>>;
export type SetSide = React.Dispatch<React.SetStateAction<Cards.Side>>;

export interface EditCardContext {
  state: EditCardState | null;
  editState: EditState | null;
  onCreateCard: OnCreateCard | null;
  setSide: SetSide;
  side: Cards.Side;
  setTarget: SetTarget;
}

export type UseEditCardTemplateSchemaItemReturn = {
  onChange: <T extends Templates.DataType>(
    validatedValue: PartialDataValue<T>,
  ) => void;
  validatedValue: PartialDataValue;
  placeholder?: string;
  hasChanges: boolean;
};
