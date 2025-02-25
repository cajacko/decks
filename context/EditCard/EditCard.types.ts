import React from "react";
import { Decks, Templates } from "@/store/types";
import { WritableDraft } from "immer";

export type CardOrDeckId = { cardId: string } | { deckId: string };

export type OnCreateCard = (cardId: string) => void;

export type EditCardProviderProps = CardOrDeckId & {
  children?: React.ReactNode;
  onCreateCard?: OnCreateCard | null;
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

export interface EditCardState {
  /**
   * Deck ID is used when creating a new card for a deck
   */
  cardOrDeckId: CardOrDeckId;
  front: EditDataValueMap;
  back: EditDataValueMap;
  hasChanges: {
    front: Record<string, boolean | undefined>;
    back: Record<string, boolean | undefined>;
  };
  getContextState: () => EditCardState;
}

export type EditDraftRecipe = (draft: WritableDraft<EditCardState>) => void;

export type EditState = (recipe: EditDraftRecipe) => void;

export interface EditCardContext {
  state: EditCardState;
  editState: EditState;
  onCreateCard: OnCreateCard | null;
}

export type UseEditCardTemplateSchemaItemReturn = {
  onChange: <T extends Templates.DataType>(
    validatedValue: PartialDataValue<T>,
  ) => void;
  validatedValue: PartialDataValue;
  placeholder?: string;
  hasChanges: boolean;
};
