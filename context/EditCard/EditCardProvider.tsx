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
import getHasChanges from "./getHasChanges";
import { CardOrDeckId, getIsSameId } from "@/utils/cardOrDeck";

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

function getInitState(
  props: CardOrDeckId & {
    front: LooseCardTemplateData;
    back: LooseCardTemplateData;
    frontTemplateId: Templates.TemplateId;
    backTemplateId: Templates.TemplateId;
    stateRef: React.MutableRefObject<Types.EditCardState | undefined>;
  },
): Types.EditCardState {
  return {
    targetId: props.targetId,
    targetType: props.targetType,
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
        const savedItem = data[key];
        const draftItem = draft[side][key];

        // There's no draft item so we can just use the saved info as it is
        // Or there is a type mismatch (which shouldn't really happen unless we have background
        // syncing of data and we're not creating new data items for them). But if we do have a
        // mismatch just use the saved value
        if (!draftItem || draftItem.type !== savedItem.type) {
          draft[side][key] = templateDataItemToEditingDataValue(
            savedItem,
            templateId,
          );

          draft.hasChanges[side][key] = false;

          continue;
        }

        const savedItemValue = savedItem.validatedValue?.value ?? null;

        // There's a new saved value so update the draft item saved item
        if (draftItem.savedValue !== savedItemValue) {
          draftItem.savedValue = savedItemValue;
        }

        draft.hasChanges[side][key] = getHasChanges(
          draftItem.editValue,
          draftItem.savedValue,
        );
      }
    }

    updateSide("front");
    updateSide("back");
  };
}

export default function EditCardProvider({
  children,
  onCreateCard = null,
  targetId,
  targetType,
}: Types.EditCardProviderProps) {
  const frontTemplateId = useRequiredAppSelector(
    (state) =>
      selectCardTemplate(state, { targetId, targetType, side: "front" })
        ?.templateId,
  );
  const backTemplateId = useRequiredAppSelector(
    (state) =>
      selectCardTemplate(state, { targetId, targetType, side: "back" })
        ?.templateId,
  );
  const front = useRequiredAppSelector((state) =>
    selectCardTemplateData(state, { targetId, targetType, side: "front" }),
  );
  const back = useRequiredAppSelector((state) =>
    selectCardTemplateData(state, { targetId, targetType, side: "back" }),
  );

  const stateRef = React.useRef<Types.EditCardState>();

  const [state, setState] = React.useState<Types.EditCardState>(
    (): Types.EditCardState =>
      getInitState({
        targetId,
        targetType,
        front,
        back,
        frontTemplateId,
        backTemplateId,
        stateRef,
      }),
  );

  stateRef.current = state;

  const prevCardOrDeckId = React.useRef<CardOrDeckId>({
    targetId,
    targetType,
  });

  const hasInitialised = React.useRef(false);

  const editState = React.useCallback<Types.EditState>((recipe) => {
    setState((prevState) => produce(prevState, recipe));
  }, []);

  const value = React.useMemo<Types.EditCardContext>(
    () => ({ state, editState, onCreateCard }),
    [state, editState, onCreateCard],
  );

  React.useEffect(() => {
    // When the card id changes, nuke everything and start again
    if (!getIsSameId({ targetId, targetType }, prevCardOrDeckId.current)) {
      prevCardOrDeckId.current = {
        targetId,
        targetType,
      };

      editState((draft) => {
        draft = getInitState({
          targetId,
          targetType,
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
  }, [
    targetId,
    targetType,
    editState,
    back,
    front,
    frontTemplateId,
    backTemplateId,
  ]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
