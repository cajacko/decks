import React from "react";
import { Cards, Templates } from "@/store/types";
import { Target } from "@/utils/cardTarget";
import {
  ResolvedCardData,
  UpdatedDataItem,
  ValidatedValue,
  FallbackValueOrigin,
} from "@/utils/resolveCardData";

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

export interface EditCardState extends ResolvedCardData {
  target: Target;
  getContextState: () => EditCardState;
  getHasChanges: () => boolean;
}

export type SetTarget = React.Dispatch<React.SetStateAction<Target | null>>;
export type SetSide = React.Dispatch<React.SetStateAction<Cards.Side>>;

export interface EditCardContext {
  state: EditCardState | null;
  onCreateCard: OnCreateCard | null;
  setSide: SetSide;
  side: Cards.Side;
  setTarget: SetTarget;
  updateEditingDataItem: (props: UpdatedDataItem) => void;
}

export type UseEditCardTemplateSchemaItemReturn = {
  onChange: (validatedValue: Templates.ValidatedValue | undefined) => void;
  validatedValue: ValidatedValue | undefined;
  placeholder?: string;
  hasChanges: boolean;
  usingFallback: FallbackValueOrigin | null;
};
