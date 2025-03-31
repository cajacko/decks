import React from "react";
import { Target, getIsSameTarget } from "@/utils/cardTarget";
import { useContextSelector } from "./useContextSelector";
import { SetTarget, OnChangeTarget } from "./EditCard.types";
import AppError from "@/classes/AppError";

/**
 * Internal hook for EditCardProvider
 */
export function _useTarget({
  onChangeTarget,
  target: propsTarget,
}: {
  target: Target | null;
  onChangeTarget?: OnChangeTarget | null;
}) {
  const [target, _setTarget] = React.useState<Target | null>(propsTarget);
  const prevTarget = React.useRef<Target | null>(target);
  prevTarget.current = target;

  const setTarget = React.useCallback<SetTarget>(
    (_newTarget) => {
      let newTarget: Target | null;

      if (typeof _newTarget === "function") {
        newTarget = _newTarget(prevTarget.current);
      } else {
        newTarget = _newTarget;
      }

      // We can't call onChangeTarget within the _setTarget call and we don't want to call it on the
      // useEffect, so doing it like this
      onChangeTarget?.(newTarget);
      _setTarget(newTarget);
    },
    [onChangeTarget, _setTarget],
  );

  useSetTarget(propsTarget, setTarget);

  return [target, setTarget] as const;
}

export function useTarget(): Target | null | undefined {
  return useContextSelector((state) => state?.state?.target);
}

export function useSetTarget(
  target?: Target | null,
  setTarget?: SetTarget,
): SetTarget | null {
  const contextSetTarget = useContextSelector((state) => state?.setTarget);
  const finalSetTarget = setTarget ?? contextSetTarget;

  React.useEffect(() => {
    // If target is undefined we don't want to unset it. This usually means we're calling this hook
    // just for the return function
    if (target === undefined) return;

    if (!finalSetTarget) {
      new AppError(
        `${useSetTarget.name} could not find a setTarget function. We shouldn't get here`,
      ).log("error");

      return;
    }

    finalSetTarget((prevTarget) => {
      if (target === null) return null;
      if (!prevTarget) return target;

      if (getIsSameTarget(prevTarget, target)) {
        return prevTarget;
      }

      return target;
    });
  }, [target, finalSetTarget]);

  return finalSetTarget ?? null;
}
