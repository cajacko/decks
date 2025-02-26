import React from "react";
import { Target, getIsSameTarget } from "@/utils/cardTarget";
import { useContextSelector } from "./useContextSelector";
import { EditCardContext } from "./EditCard.types";
import AppError from "@/classes/AppError";

type SetTarget = EditCardContext["setTarget"];

export default function useControlTarget(
  target: Target | null,
  setTarget?: SetTarget,
) {
  const contextSetTarget = useContextSelector((state) => state?.setTarget);
  const finalSetTarget = setTarget ?? contextSetTarget;

  React.useEffect(() => {
    // We're already logging above, so all goi
    if (!finalSetTarget) {
      new AppError(
        `${useControlTarget.name} could not find a setTarget function. We shouldn't get here`,
      ).log("error");

      return;
    }

    finalSetTarget((prevTarget) => {
      if (!target) return null;
      if (!prevTarget) return target;

      if (getIsSameTarget(prevTarget, target)) {
        return prevTarget;
      }

      return target;
    });
  }, [target, finalSetTarget]);
}
