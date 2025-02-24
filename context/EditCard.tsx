import React from "react";
import { Cards, Templates } from "@/store/types";
import { useAppSelector } from "@/store/hooks";
import { selectCardTemplateData } from "@/store/combinedSelectors/cards";
import { Values } from "@/components/Template/templateDataToValues";
import { createContext, useContextSelector } from "use-context-selector";
import { produce, WritableDraft } from "immer";

type PartialDataValue<T extends Templates.DataType = Templates.DataType> = {
  [K in T]: {
    type: Templates.ValidatedValue<K>["type"];
    value?: Templates.ValidatedValue<K>["value"];
  };
}[T];

type LooseEditingDataValues<T extends Templates.DataType = Templates.DataType> =
  {
    type: Templates.ValidatedValue<T>["type"];
    savedValue?: Templates.ValidatedValue<T>["value"];
    editValue?: Templates.ValidatedValue<T>["value"];
    hasChanges: boolean;
  };

type EditingDataValues<T extends Templates.DataType = Templates.DataType> = {
  [K in T]: LooseEditingDataValues<K>;
}[T];

export type EditDataValueMap = Record<
  string,
  LooseEditingDataValues | undefined
>;

interface EditCardState {
  front: EditDataValueMap;
  back: EditDataValueMap;
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

  const editState = useContextSelector(
    Context,
    (context) => context?.editState,
  );

  if (!editingItem || !editState) {
    throw new Error(
      `Template schema item ${props.templateSchemaItemId} not found`,
    );
  }

  const onChange = React.useCallback(
    <T extends Templates.DataType>(value: PartialDataValue<T>) => {
      editState((draft) => {
        const editingItemDraft = draft[props.side][props.templateSchemaItemId];

        const newEditingItem: EditingDataValues<T> = {
          type: value.type,
          editValue: value.value,
          hasChanges: true,
          savedValue: undefined,
        };

        if (!editingItemDraft) {
          draft[props.side][props.templateSchemaItemId] = newEditingItem;

          return;
        }

        if (editingItemDraft.editValue === value.value) return;

        if (editingItemDraft.type !== value.type) {
          // NOTE: We should never get to here, it's only if something updated from the api like a
          // new data type change or something. Best never to change data types, just create new
          // ones?
          draft[props.side][props.templateSchemaItemId] = newEditingItem;
        } else {
          editingItemDraft.editValue = value.value;

          editingItemDraft.hasChanges =
            editingItemDraft.savedValue !== editingItemDraft.editValue;
        }
      });
    },
    [props.side, props.templateSchemaItemId, editState],
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
    hasChanges: !!editingItem.hasChanges,
  };
}

export function useEditCardStatus(): {
  save: () => void;
  hasChanges: boolean;
} {
  return {
    save: () => {},
    hasChanges: false,
  };
}

function templateDataItemToEditingDataValue<T extends Templates.DataType>(
  item: Templates.LooseDataItem<T>,
): EditingDataValues<T> {
  const value = item.validatedValue?.value;

  return {
    type: item.type,
    hasChanges: false,
    savedValue: value,
    editValue: value,
  };
}

function templateDataToEditingValues(data: Templates.Data): EditDataValueMap {
  const result: EditDataValueMap = {};

  for (const key in data) {
    result[key] = templateDataItemToEditingDataValue(data[key]);
  }

  return result;
}

export const EditCardProvider: React.FC<{
  children?: React.ReactNode;
  cardId: string;
}> = ({ children, cardId }) => {
  const front = useAppSelector(
    (state) => selectCardTemplateData(state, { cardId, side: "front" })?.data,
  );
  const back = useAppSelector(
    (state) => selectCardTemplateData(state, { cardId, side: "front" })?.data,
  );

  if (!front) {
    throw new Error(`Front template not found for card ${cardId}`);
  }

  if (!back) {
    throw new Error(`Back template not found for card ${cardId}`);
  }

  const [state, setState] = React.useState<EditCardState>(() => ({
    front: templateDataToEditingValues(front),
    back: templateDataToEditingValues(back),
  }));

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
        draft.back = templateDataToEditingValues(back);
        draft.front = templateDataToEditingValues(front);
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
        const data = side === "front" ? front : back;

        for (const key in data) {
          const dataItem = data[key];
          const draftItem = draft[side][key];

          if (draftItem) {
            // The saved/ editing types have changed. This shouldn't really happen unless background
            // api's are updating types with the same id
            if (draftItem.type !== dataItem.type) {
              draft[side][key] = templateDataItemToEditingDataValue(dataItem);
            } else {
              if (draftItem.savedValue !== dataItem.validatedValue?.value) {
                draftItem.savedValue = dataItem.validatedValue?.value;
              }

              // Do a new check for changes
              const hasChanges = draftItem.editValue !== draftItem.savedValue;

              if (hasChanges !== draftItem.hasChanges) {
                draftItem.hasChanges = hasChanges;
              }
            }
          } else {
            draft[side][key] = templateDataItemToEditingDataValue(dataItem);
          }
        }
      }

      updateSide("front");
      updateSide("back");
    });

    // The saved data has changed, lets update it
  }, [cardId, editState, back, front]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
};
