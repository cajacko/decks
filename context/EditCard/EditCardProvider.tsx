import React from "react";
import { Cards, Templates } from "@/store/types";
import { useRequiredAppSelector } from "@/store/hooks";
import {
  selectCardTemplateData,
  LooseCardTemplateDataItem,
  LooseCardTemplateData,
  selectCardTemplate,
} from "@/store/combinedSelectors/cards";
import { produce } from "immer";
import * as Types from "./EditCard.types";
import { context as Context } from "./useContextSelector";

function templateDataItemToEditingDataValue<T extends Templates.DataType>(
  item: LooseCardTemplateDataItem<T>,
  templateId: Templates.TemplateId,
): Types.EditingDataValues<T> {
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
): Types.EditDataValueMap {
  const result: Types.EditDataValueMap = {};

  for (const key in data) {
    result[key] = templateDataItemToEditingDataValue(data[key], templateId);
  }

  return result;
}

function getInitState(props: {
  cardId: string;
  front: LooseCardTemplateData;
  back: LooseCardTemplateData;
  frontTemplateId: Templates.TemplateId;
  backTemplateId: Templates.TemplateId;
  stateRef: React.MutableRefObject<Types.EditCardState | undefined>;
}): Types.EditCardState {
  return {
    cardId: props.cardId,
    front: templateDataToEditingValues(props.front, props.frontTemplateId),
    back: templateDataToEditingValues(props.back, props.backTemplateId),
    hasChanges: {
      back: {},
      front: {},
    },
    getContextState: () => {
      if (!props.stateRef.current) {
        throw new Error(
          "getContextState called before state was initialised in EditCardProvider",
        );
      }

      return props.stateRef.current;
    },
  };
}

function withUpdateStateFromProps(props: {
  front: LooseCardTemplateData;
  back: LooseCardTemplateData;
  frontTemplateId: Templates.TemplateId;
  backTemplateId: Templates.TemplateId;
}): Types.EditDraftRecipe {
  const { back, backTemplateId, front, frontTemplateId } = props;

  return (draft) => {
    function updateSide(side: Cards.Side) {
      const templateId = side === "front" ? frontTemplateId : backTemplateId;
      const data = side === "front" ? front : back;

      for (const key in data) {
        const dataItem = data[key];
        const draftItem = draft[side][key];

        // There's no draft item so we can just use the saved info as it is
        // Or there is a type mismatch (which shouldn't really happen unless we have background
        // syncing of data and we're not creating new data items for them). But if we do have a
        // mismatch just use the saved value
        if (!draftItem || draftItem.type !== dataItem.type) {
          draft[side][key] = templateDataItemToEditingDataValue(
            dataItem,
            templateId,
          );

          continue;
        }

        const haveEditedDataItem = draft.hasChanges[side][key];

        // There's a new saved value so update the draft item, unless we've been editing it, in
        // which case keep the edit
        if (
          draftItem.savedValue !== dataItem.validatedValue?.value &&
          !haveEditedDataItem
        ) {
          draftItem.savedValue = dataItem.validatedValue?.value ?? null;
        }
        // Do a new check for changes
        const hasChanges = draftItem.editValue !== draftItem.savedValue;

        // Update the changed state
        if (hasChanges !== draft.hasChanges[side][key]) {
          draft.hasChanges[side][key] = hasChanges;
        }
      }
    }

    updateSide("front");
    updateSide("back");
  };
}

export default function EditCardProvider({
  children,
  cardId,
}: Types.EditCardProviderProps) {
  const frontTemplateId = useRequiredAppSelector(
    (state) => selectCardTemplate(state, { cardId, side: "front" })?.templateId,
  );
  const backTemplateId = useRequiredAppSelector(
    (state) => selectCardTemplate(state, { cardId, side: "back" })?.templateId,
  );
  const front = useRequiredAppSelector((state) =>
    selectCardTemplateData(state, { cardId, side: "front" }),
  );
  const back = useRequiredAppSelector((state) =>
    selectCardTemplateData(state, { cardId, side: "front" }),
  );

  const stateRef = React.useRef<Types.EditCardState>();

  const [state, setState] = React.useState<Types.EditCardState>(
    (): Types.EditCardState =>
      getInitState({
        cardId,
        front,
        back,
        frontTemplateId,
        backTemplateId,
        stateRef,
      }),
  );

  stateRef.current = state;

  const prevCardId = React.useRef(cardId);
  const hasInitialised = React.useRef(false);

  const editState = React.useCallback<Types.EditState>((recipe) => {
    setState((prevState) => produce(prevState, recipe));
  }, []);

  const value = React.useMemo<Types.EditCardContext>(
    () => ({ state, editState }),
    [state, editState],
  );

  React.useEffect(() => {
    // When the card id changes, nuke everything and start again
    if (cardId !== prevCardId.current) {
      prevCardId.current = cardId;

      editState((draft) => {
        draft = getInitState({
          cardId,
          front,
          back,
          frontTemplateId,
          backTemplateId,
          stateRef,
        });
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
    editState(
      withUpdateStateFromProps({
        back,
        backTemplateId,
        front,
        frontTemplateId,
      }),
    );
  }, [cardId, editState, back, front, frontTemplateId, backTemplateId]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
