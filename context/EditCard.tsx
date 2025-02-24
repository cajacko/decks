import React from "react";
import { Cards, Decks, Templates } from "@/store/types";
import { useRequiredAppSelector, useAppDispatch } from "@/store/hooks";
import { updateCard, CardDataItem } from "@/store/combinedActions/cards";
import {
  selectCardTemplateData,
  LooseCardTemplateDataItem,
  LooseCardTemplateData,
  selectCardTemplate,
} from "@/store/combinedSelectors/cards";
import { selectCard } from "@/store/slices/cards";
import { selectTemplateSchemaItem } from "@/store/slices/templates";
import { Values } from "@/components/Template/templateDataToValues";
import { createContext, useContextSelector } from "use-context-selector";
import { produce, WritableDraft } from "immer";
import { store } from "@/store/store";

type PartialDataValue<T extends Templates.DataType = Templates.DataType> = {
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

type EditingDataValues<T extends Templates.DataType = Templates.DataType> = {
  [K in T]: LooseEditingDataValues<K>;
}[T];

export type EditDataValueMap = Record<
  string,
  LooseEditingDataValues | undefined
>;

interface EditCardState {
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

type EditState = (
  recipe: (draft: WritableDraft<EditCardState>) => void,
) => void;

interface EditCardContext {
  state: EditCardState;
  editState: EditState;
}

const Context = createContext<EditCardContext | null>(null);

export function useEditCardTemplateValues({
  side,
}: {
  side: Cards.Side;
}): Values | null {
  const data = useContextSelector(Context, (context) => context?.state[side]);

  return React.useMemo<Values | null>(() => {
    if (!data) return null;

    const values: Values = {};

    for (const key in data) {
      const prop = data[key];

      if (prop) {
        values[key] = prop.editValue;
      }
    }

    return values;
  }, [data]);
}

export function useEditCardTemplateSchemaItem(props: {
  side: Cards.Side;
  templateSchemaItemId: string;
}): {
  onChange: <T extends Templates.DataType>(
    validatedValue: PartialDataValue<T>,
  ) => void;
  validatedValue: PartialDataValue;
  placeholder?: string;
  hasChanges: boolean;
} {
  const editingItem = useContextSelector(
    Context,
    (context) => context?.state[props.side][props.templateSchemaItemId],
  );

  const hasChanges = useContextSelector(
    Context,
    (context) =>
      context?.state.hasChanges[props.side][props.templateSchemaItemId],
  );

  const editState = useContextSelector(
    Context,
    (context) => context?.editState,
  );

  if (!editingItem || !editState) {
    throw new Error(
      `Template schema item ${props.templateSchemaItemId} not found`,
    );
  }

  const templateId = editingItem.templateId;
  const templateItemId = editingItem.templateItemId;

  const onChange = React.useCallback(
    <T extends Templates.DataType>(value: PartialDataValue<T>) => {
      editState((draft) => {
        const editingItemDraft = draft[props.side][props.templateSchemaItemId];

        const newEditingItem: EditingDataValues<T> = {
          templateId: editingItemDraft?.templateId ?? templateId,
          cardDataItemId: null,
          templateItemId: editingItemDraft?.templateItemId ?? templateItemId,
          type: value.type,
          editValue: value.value ?? null,
          savedValue: null,
        };

        // If the item doesn't exist, it's new
        if (!editingItemDraft) {
          // There's no new value to set anyways so return.
          if (!value.value) return;

          draft[props.side][props.templateSchemaItemId] = newEditingItem;
          draft.hasChanges[props.side][props.templateSchemaItemId] = true;

          return;
        }

        // Don't update something that has no changes
        if (editingItemDraft.editValue === value.value) return;

        if (editingItemDraft.type !== value.type) {
          // NOTE: We should never get to here, it's only if something updated from the api like a
          // new data type change or something. Best never to change data types, just create new
          // ones?
          draft[props.side][props.templateSchemaItemId] = newEditingItem;
          draft.hasChanges[props.side][props.templateSchemaItemId] = true;
        } else {
          editingItemDraft.editValue = value.value ?? null;

          const hasSavedValue = !!editingItemDraft.savedValue;
          const hasEditValue = !!editingItemDraft.editValue;

          // If both values are empty, we don't have any changes
          if (!hasSavedValue && !hasEditValue) {
            draft.hasChanges[props.side][props.templateSchemaItemId] = false;

            return;
          }

          draft.hasChanges[props.side][props.templateSchemaItemId] =
            editingItemDraft.savedValue !== editingItemDraft.editValue;
        }
      });
    },
    [
      props.side,
      props.templateSchemaItemId,
      editState,
      templateItemId,
      templateId,
    ],
  );

  const validatedValue = React.useMemo<PartialDataValue>(() => {
    return {
      type: editingItem.type,
      value: editingItem.editValue,
    } as PartialDataValue;
  }, [editingItem.type, editingItem.editValue]);

  return {
    onChange,
    validatedValue,
    hasChanges: !!hasChanges,
  };
}

export function useEditCardStatus(): {
  save: () => void;
  hasChanges: boolean;
} {
  const dispatch = useAppDispatch();

  const hasChangesMap = useContextSelector(
    Context,
    (context) => context?.state.hasChanges,
  );

  const getContextState = useContextSelector(
    Context,
    (context) => context?.state.getContextState,
  );

  if (!getContextState || !hasChangesMap) {
    throw new Error("EditCardStatus must be used within a EditCardProvider");
  }

  const hasChanges = React.useMemo(
    () =>
      Object.values(hasChangesMap.front).some((hasChanges) => !!hasChanges) ||
      Object.values(hasChangesMap.back).some((hasChanges) => !!hasChanges),
    [hasChangesMap],
  );

  return {
    save: React.useCallback(() => {
      const contextState = getContextState();

      const data: CardDataItem[] = [];

      function processSide(side: Cards.Side) {
        const editingValues = contextState[side];

        for (const key in editingValues) {
          // Don't save all for performance and to ensure we keep the hasChanges logic up to date
          if (contextState.hasChanges[side][key] !== true) continue;

          const editingValue = editingValues[key];

          if (editingValue) {
            const value: Templates.ValidatedValue | null =
              editingValue.editValue
                ? ({
                    type: editingValue.type,
                    value: editingValue.editValue,
                  } as Templates.ValidatedValue) // FIXME:
                : null;

            if (editingValue.cardDataItemId) {
              data.push({
                cardDataId: editingValue.cardDataItemId,
                value,
              });
            } else {
              const templateDataItemTitle = selectTemplateSchemaItem(
                store.getState(),
                {
                  templateId: editingValue.templateId,
                  templateSchemaItemId: editingValue.templateItemId,
                },
              )?.name;

              if (!templateDataItemTitle) {
                throw new Error(
                  `Template data item ${editingValue.templateItemId} not found`,
                );
              }

              data.push({
                templateDataItemId: editingValue.templateItemId,
                side,
                value,
                templateDataItemTitle,
              });
            }
          }
        }
      }

      processSide("front");
      processSide("back");

      dispatch(
        updateCard({
          cardId: contextState.cardId,
          data,
          deckId: contextState.deckId,
        }),
      );
    }, [getContextState, dispatch]),
    hasChanges,
  };
}

function templateDataItemToEditingDataValue<T extends Templates.DataType>(
  item: LooseCardTemplateDataItem<T>,
  templateId: Templates.TemplateId,
): EditingDataValues<T> {
  const value = item.validatedValue?.value;

  return {
    templateId,
    cardDataItemId: item.cardDataItemId,
    templateItemId: item.id,
    type: item.type,
    savedValue: value ?? null,
    editValue: value ?? null,
  };
}

function templateDataToEditingValues(
  data: LooseCardTemplateData,
  templateId: Templates.TemplateId,
): EditDataValueMap {
  const result: EditDataValueMap = {};

  for (const key in data) {
    result[key] = templateDataItemToEditingDataValue(data[key], templateId);
  }

  return result;
}

export const EditCardProvider: React.FC<{
  children?: React.ReactNode;
  cardId: string;
}> = ({ children, cardId }) => {
  const frontTemplateId = useRequiredAppSelector(
    (state) => selectCardTemplate(state, { cardId, side: "front" })?.templateId,
  );
  const backTemplateId = useRequiredAppSelector(
    (state) => selectCardTemplate(state, { cardId, side: "back" })?.templateId,
  );
  const front = useRequiredAppSelector(
    (state) => selectCardTemplateData(state, { cardId, side: "front" })?.data,
  );
  const back = useRequiredAppSelector(
    (state) => selectCardTemplateData(state, { cardId, side: "front" })?.data,
  );
  const deckId = useRequiredAppSelector(
    (state) => selectCard(state, { cardId })?.deckId,
  );

  const [state, setState] = React.useState<EditCardState>(
    (): EditCardState => ({
      cardId,
      deckId,
      front: templateDataToEditingValues(front, frontTemplateId),
      back: templateDataToEditingValues(back, backTemplateId),
      hasChanges: {
        back: {},
        front: {},
      },
      getContextState: () => stateRef.current,
    }),
  );

  const stateRef = React.useRef<EditCardState>(state);
  stateRef.current = state;

  const prevCardId = React.useRef(cardId);
  const hasInitialised = React.useRef(false);

  const editState = React.useCallback<EditState>((recipe) => {
    setState((prevState) => produce(prevState, recipe));
  }, []);

  const value = React.useMemo<EditCardContext>(
    () => ({ state, editState }),
    [state, editState],
  );

  React.useEffect(() => {
    // When the card id changes, nuke everything and start again
    if (cardId !== prevCardId.current) {
      prevCardId.current = cardId;

      editState((draft) => {
        draft = {
          cardId,
          deckId,
          front: templateDataToEditingValues(front, frontTemplateId),
          back: templateDataToEditingValues(back, backTemplateId),
          hasChanges: {
            back: {},
            front: {},
          },
          getContextState: () => draft,
        };
      });

      return;
    }

    // This effect runs on mount as well as the prop changes, we already set the initial state, so
    // this helps us avoid running again on mount
    if (!hasInitialised.current) {
      hasInitialised.current = true;

      return;
    }

    // We have new saved data lets update

    editState((draft) => {
      function updateSide(side: Cards.Side) {
        const templateId = side === "front" ? frontTemplateId : backTemplateId;
        const data = side === "front" ? front : back;

        for (const key in data) {
          const dataItem = data[key];
          const draftItem = draft[side][key];

          if (draftItem) {
            // The saved/ editing types have changed. This shouldn't really happen unless background
            // api's are updating types with the same id
            if (draftItem.type !== dataItem.type) {
              draft[side][key] = templateDataItemToEditingDataValue(
                dataItem,
                templateId,
              );
            } else {
              if (draftItem.savedValue !== dataItem.validatedValue?.value) {
                draftItem.savedValue = dataItem.validatedValue?.value ?? null;
              }

              // Do a new check for changes
              const hasChanges = draftItem.editValue !== draftItem.savedValue;

              if (hasChanges !== draft.hasChanges[side][key]) {
                draft.hasChanges[side][key] = hasChanges;
              }
            }
          } else {
            draft[side][key] = templateDataItemToEditingDataValue(
              dataItem,
              templateId,
            );
          }
        }
      }

      updateSide("front");
      updateSide("back");
    });

    // The saved data has changed, lets update it
  }, [cardId, editState, back, front, frontTemplateId, backTemplateId]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
};
