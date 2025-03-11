import React from "react";
import { Cards, Decks, Templates } from "@/store/types";
import { WritableDraft } from "immer";
import { Target } from "@/utils/cardTarget";

export type OnCreateCard = (cardId: string) => void;
export type OnChangeTarget = (target: Target | null) => void;

export type DefaultValueLocation = "deck" | "template" | "template-map";

export type EditCardProviderProps = {
  /**
   * null - When you want the context children to decide what the target is dynamically
   * type = "deck" - when you want to create a new card in a deck
   * type = "card" - when you want to edit an existing card
   */
  target: Target | null;
  side?: Cards.Side;
  children?: React.ReactNode;
  onChangeSide?: (side: Cards.Side) => void;
  onCreateCard?: OnCreateCard | null;
  onChangeTarget?: OnChangeTarget | null;
};

type LooseEditingDataValues<
  T extends Templates.FieldType = Templates.FieldType,
> = {
  cardDataItemId: Decks.DataId;
  fieldType: T;
  savedValidatedValue: Templates.ValidatedValue<T> | undefined;
  editValidatedValue: Templates.ValidatedValue<T> | undefined;
};

export type EditingDataValues<
  T extends Templates.FieldType = Templates.FieldType,
> = {
  [K in T]: LooseEditingDataValues<K>;
}[T];

export type EditDataValueMap = Record<
  string,
  LooseEditingDataValues | undefined
>;

export type HasChangesMap = Record<string, boolean | undefined>;

export type EditCardState = {
  target: Target;
  data: EditDataValueMap;
  templateMapping: {
    front: Record<string, string | undefined>;
    back: Record<string, string | undefined>;
  };
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
  onChange: (validatedValue: Templates.ValidatedValue | undefined) => void;
  fieldType: Templates.FieldType;
  validatedValue: Templates.ValidatedValue | undefined;
  placeholder?: string;
  hasChanges: boolean;
  /**
   * If the validatedValue is a default value, what kind is it?
   */
  usingDefault: DefaultValueLocation | null;
};
