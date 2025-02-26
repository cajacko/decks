import React from "react";
import { Cards, Templates } from "@/store/types";
import { useAppSelector } from "@/store/hooks";
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
import { Target, getIsSameTarget } from "@/utils/cardTarget";
import AppError from "@/classes/AppError";
import useControlTarget from "./useControlTarget";

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

function stateFromProps(props: {
  target?: Target | null;
  front?: LooseCardTemplateData | null;
  back?: LooseCardTemplateData | null;
  frontTemplateId?: Templates.TemplateId | null;
  backTemplateId?: Templates.TemplateId | null;
  stateRef: React.MutableRefObject<Types.EditCardState | null>;
}): Types.EditCardState | null {
  if (
    !props.target ||
    !props.front ||
    !props.back ||
    !props.frontTemplateId ||
    !props.backTemplateId
  ) {
    return null;
  }

  return {
    target: props.target,
    front: templateDataToEditingValues(props.front, props.frontTemplateId),
    back: templateDataToEditingValues(props.back, props.backTemplateId),
    hasChanges: {
      back: {},
      front: {},
    },
    getContextState: () => {
      if (!props.stateRef.current) {
        throw new AppError(
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
  target: targetProp,
}: Types.EditCardProviderProps) {
  const [target, setTarget] = React.useState<Target | null>(targetProp);

  useControlTarget(targetProp, setTarget);

  const frontTemplateId = useAppSelector((state) =>
    target
      ? selectCardTemplate(state, { ...target, side: "front" })?.templateId
      : null,
  );
  const backTemplateId = useAppSelector((state) =>
    target
      ? selectCardTemplate(state, { ...target, side: "back" })?.templateId
      : null,
  );
  const front = useAppSelector((state) =>
    target ? selectCardTemplateData(state, { ...target, side: "front" }) : null,
  );
  const back = useAppSelector((state) =>
    target ? selectCardTemplateData(state, { ...target, side: "back" }) : null,
  );

  const stateRef = React.useRef<Types.EditCardState | null>(null);

  const [state, setState] = React.useState<Types.EditCardState | null>(
    (): Types.EditCardState | null =>
      stateFromProps({
        target,
        front,
        back,
        frontTemplateId,
        backTemplateId,
        stateRef,
      }),
  );

  stateRef.current = state;

  const prevTarget = React.useRef<Target | null>(target);

  const hasInitialised = React.useRef(false);
  const hasState = !!state;

  // We can only edit state if it exists
  const editState = React.useMemo<Types.EditState | null>(() => {
    if (!hasState) return null;

    return (recipe) => {
      // This condition shouldn't actually trigger based on the conditional above
      setState((prevState) => {
        if (prevState === null) {
          new AppError(
            `${EditCardProvider.name}: Edit state called with no state, this should have been handled by conditionals`,
          ).log("error");

          return prevState;
        }

        return produce<Types.EditCardState>(prevState, recipe);
      });
    };
  }, [hasState]);

  const value = React.useMemo<Types.EditCardContext>(
    () => ({ state, editState, onCreateCard, setTarget }),
    [state, editState, onCreateCard],
  );

  // Update the state when the target or it's saved props changes
  React.useEffect(() => {
    // If we don't have a target set the state to null
    if (target === null) {
      prevTarget.current = target;

      // NOTE: React won't re-render/ go into a effect/ setState loop if the value is the same
      setState(target);

      return;
    }

    // When the target changes, or we unset it nuke everything and start again
    if (
      // We've checked above that the target already exists so if the prevTarget is null there's a
      // change
      prevTarget.current === null ||
      !getIsSameTarget(target, prevTarget.current)
    ) {
      prevTarget.current = target;

      setState(
        stateFromProps({
          target,
          front,
          back,
          frontTemplateId,
          backTemplateId,
          stateRef,
        }),
      );

      return;
    }

    // This effect runs on mount as well as the prop changes, we already set the initial state, so
    // this helps us avoid running again on mount
    if (!hasInitialised.current) {
      hasInitialised.current = true;

      return;
    }

    if (!front || !back || !frontTemplateId || !backTemplateId) {
      new AppError(
        `Front, back, frontTemplateId or backTemplateId not set when we have prop changes to apply`,
      ).log("error");

      return;
    }

    // This should be defined by now, fallback to overriding the state with the new saved props, as
    // we can't edit the state. So we either leave things as they are or override them. Neither is
    // great so avoid getting here
    if (!editState) {
      new AppError(
        `editState not set in ${EditCardProvider.name} when we have prop changes to apply`,
      ).log("error");

      const newSavedState = stateFromProps({
        target,
        front,
        back,
        frontTemplateId,
        backTemplateId,
        stateRef,
      });

      if (!newSavedState) {
        new AppError(
          `${EditCardProvider.name} could not apply fallback state changes, we shouldn't be here`,
        ).log("error");

        setState(null);

        return;
      }

      setState(newSavedState);

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
  }, [target, editState, back, front, frontTemplateId, backTemplateId]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
