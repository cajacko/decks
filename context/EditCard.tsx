import React from "react";
import { Templates } from "@/store/types";
import { useAppSelector } from "@/store/hooks";
import { selectCardTemplateData } from "@/store/combinedSelectors/cards";
import { Values } from "@/components/Template/templateDataToValues";
import { createContext, useContextSelector } from "use-context-selector";

type ValidatedPartialDataValue<T extends Templates.DataType> = {
  type: Templates.DataValue<T>["type"];
  value?: Templates.DataValue<T>["value"];
};

type ValidatedEditingDataType<T extends Templates.DataType> = {
  type: Templates.DataValue<T>["type"];
  savedValue?: Templates.DataValue<T>["value"];
  editValue?: Templates.DataValue<T>["value"];
  hasChanges: boolean;
};

type EditingDataValue<T extends Templates.DataType = Templates.DataType> = {
  [K in Templates.DataType]: ValidatedEditingDataType<K>;
}[T];

type PartialDataValue<T extends Templates.DataType = Templates.DataType> = {
  [K in Templates.DataType]: ValidatedPartialDataValue<K>;
}[T];

export type EditDataValueMap = Record<string, EditingDataValue | undefined>;

interface EditCardState {
  front: EditDataValueMap;
  back: EditDataValueMap;
}
interface EditCardContext {
  state: EditCardState;
  setState: React.Dispatch<React.SetStateAction<EditCardState>>;
}

const Context = createContext<EditCardContext | null>(null);

export function useEditCardTemplateValues({
  side,
}: {
  side: "front" | "back";
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
  side: "front" | "back";
  templateSchemaItemId: string;
}): {
  onChange: (value: PartialDataValue) => void;
  value: PartialDataValue;
  placeholder?: string;
  hasChanges: boolean;
} {
  const editingItem = useContextSelector(
    Context,
    (context) => context?.state[props.side][props.templateSchemaItemId],
  );

  const setState = useContextSelector(Context, (context) => context?.setState);

  if (!editingItem || !setState) {
    throw new Error(
      `Template schema item ${props.templateSchemaItemId} not found`,
    );
  }

  const onChange = React.useCallback(
    (value: PartialDataValue) => {
      setState((prevState) => {
        const prop = prevState[props.side][props.templateSchemaItemId];

        let updatedProp: EditingDataValue | undefined;

        if (prop) {
          if (prop.editValue === value.value) return prevState;

          if (prop.type !== value.type) {
            updatedProp = {
              type: value.type,
              hasChanges: true,
              savedValue: undefined,
              editValue: value.value,
            };
          } else {
            updatedProp = {
              ...prop,
              hasChanges: true,
              editValue: value.value,
            };
          }
        } else {
          updatedProp = {
            type: value.type,
            hasChanges: true,
            savedValue: undefined,
            editValue: value.value,
          };
        }

        if (!updatedProp) return prevState;

        return {
          ...prevState,
          [props.side]: {
            ...prevState[props.side],
            [props.templateSchemaItemId]: updatedProp,
          },
        };
      });
    },
    [props.side, props.templateSchemaItemId, setState],
  );

  const value = React.useMemo<PartialDataValue>(() => {
    return {
      type: editingItem.type,
      value: editingItem.editValue,
    };
  }, [editingItem.type, editingItem.editValue]);

  return {
    onChange,
    value,
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

function templateDataToEditingValues(data: Templates.Data): EditDataValueMap {
  const result: EditDataValueMap = {};

  for (const key in data) {
    const item = data[key];
    const value = item.value?.value;

    result[key] = {
      type: item.type,
      hasChanges: false,
      savedValue: value,
      editValue: value,
    };
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

  const value = React.useMemo<EditCardContext>(
    () => ({ state, setState }),
    [state, setState],
  );

  React.useEffect(() => {
    setState((prevState) => {
      const newFrontData = templateDataToEditingValues(front);
      const newBackData = templateDataToEditingValues(back);

      let hasChanged = false;

      const newState = { ...prevState };

      function updateSide(side: "front" | "back") {
        const data = side === "front" ? newFrontData : newBackData;

        for (const key in data) {
          // TODO: Fill me in
        }
      }

      updateSide("front");
      updateSide("back");

      return hasChanged ? newState : prevState;
    });
  }, [front, back]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
};
