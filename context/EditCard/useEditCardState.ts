import React from "react";
import { useAppSelector } from "@/store/hooks";
import {
  selectCardTemplateData,
  selectCardTemplate,
} from "@/store/combinedSelectors/cards";
import { produce } from "immer";
import * as Types from "./EditCard.types";
import { Target, getIsSameTarget } from "@/utils/cardTarget";
import AppError from "@/classes/AppError";
import stateFromProps, { withUpdateStateFromProps } from "./stateFromProps";

/**
 * Handles the saved props from redux and when to update our context when they change. As well as
 * handling how the edit state behaves
 */
export default function useEditCardState(
  target: Target | null,
): [state: Types.EditCardState | null, editState: Types.EditState | null] {
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
            `${useEditCardState.name}: Edit state called with no state, this should have been handled by conditionals`,
          ).log("error");

          return prevState;
        }

        return produce<Types.EditCardState>(prevState, recipe);
      });
    };
  }, [hasState]);

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
        `editState not set in ${useEditCardState.name} when we have prop changes to apply`,
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
          `${useEditCardState.name} could not apply fallback state changes, we shouldn't be here`,
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
    // NOTE: This hook is only for when saved props or the target has changed, we do not want it
    // updating n other situations as we may end up overriding editing data if we do
  }, [target, editState, back, front, frontTemplateId, backTemplateId]);

  return [state, editState];
}
