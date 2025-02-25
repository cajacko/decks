import React from "react";
import { Cards, Templates } from "@/store/types";
import { useRequiredAppSelector } from "@/store/hooks";
import {
  selectCardTemplateData,
  LooseCardTemplateDataItem,
  LooseCardTemplateData,
  selectCardTemplate,
} from "@/store/combinedSelectors/cards";
import { selectCard } from "@/store/slices/cards";
import { produce } from "immer";
import * as Types from "./EditCard.types";
import Context from "./EditCard.context";

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

export default function EditCardProvider({
  children,
  cardId,
}: {
  children?: React.ReactNode;
  cardId: string;
}) {
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
  const deckId = useRequiredAppSelector(
    (state) => selectCard(state, { cardId })?.deckId,
  );

  const [state, setState] = React.useState<Types.EditCardState>(
    (): Types.EditCardState => ({
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

  const stateRef = React.useRef<Types.EditCardState>(state);
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
}
