import React from "react";
import { useAppSelector } from "@/store/hooks";
import { selectResolveCardDataProps } from "@/store/combinedSelectors/cards";
import * as Types from "./EditCard.types";
import { Target, getIsSameTarget } from "@/utils/cardTarget";
import AppError from "@/classes/AppError";
import stateFromProps from "./stateFromProps";
import debugLog from "./debugLog";
import useResolveCardData from "@/hooks/useResolveCardData";

/**
 * Handles the saved props from redux and when to update our context when they change. As well as
 * handling how the edit state behaves
 */
export default function useEditCardState(target: Target | null): {
  state: Types.EditCardState | null;
  updateEditingDataItem: Types.EditCardContext["updateEditingDataItem"];
} {
  const resolvedCardDataProps = useAppSelector((state) =>
    target ? selectResolveCardDataProps(state, target) : null,
  );

  const { resolvedCardData, updateEditingDataItem, updateProps } =
    useResolveCardData(resolvedCardDataProps);

  const stateRef = React.useRef<Types.EditCardState | null>(null);

  const [state, setState] = React.useState<Types.EditCardState | null>(
    (): Types.EditCardState | null => {
      const initState = stateFromProps({
        target,
        stateRef,
        resolvedCardData,
      });

      debugLog(`${useEditCardState.name} - init state`, initState);

      return initState;
    },
  );

  React.useEffect(() => {
    setState((prevState) =>
      prevState ? { ...prevState, ...resolvedCardData } : prevState,
    );
  }, [resolvedCardData]);

  stateRef.current = state;

  const prevTarget = React.useRef<Target | null>(target);
  const hasInitialised = React.useRef(false);

  // Update the state when the target or it's saved props changes
  React.useEffect(() => {
    // If we don't have a target set the state to null
    if (target === null) {
      prevTarget.current = target;

      debugLog(`${useEditCardState.name} - no target`, target);

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

      const newState = stateFromProps({
        target,
        stateRef,
        resolvedCardData: updateProps(resolvedCardDataProps),
      });

      debugLog(`${useEditCardState.name} - target changed`, newState);

      setState(newState);

      return;
    }

    // This effect runs on mount as well as the prop changes, we already set the initial state, so
    // this helps us avoid running again on mount
    if (!hasInitialised.current) {
      hasInitialised.current = true;

      return;
    }

    if (!resolvedCardDataProps) {
      new AppError(
        `resolvedCardDataProps not set when we have prop changes to apply`,
      ).log("error");

      return;
    }

    debugLog(
      `${useEditCardState.name} - new saved data`,
      resolvedCardDataProps,
    );

    // We have new saved data lets update
    setState((prevState) =>
      prevState
        ? { ...prevState, resolvedCardData: updateProps(resolvedCardDataProps) }
        : stateFromProps({
            target,
            stateRef,
            resolvedCardData: updateProps(resolvedCardDataProps),
          }),
    );

    // NOTE: This hook is only for when saved props or the target has changed, we do not want it
    // updating n other situations as we may end up overriding editing data if we do
  }, [target, resolvedCardDataProps, updateProps]);

  return {
    updateEditingDataItem,
    state,
  };
}
