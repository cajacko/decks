import React from "react";
import * as Types from "./EditCard.types";
import { Target } from "@/utils/cardTarget";
import AppError from "@/classes/AppError";
import { ResolvedCardData } from "@/utils/resolveCardData";

export default function stateFromProps(props: {
  target?: Target | null;
  stateRef: React.MutableRefObject<Types.EditCardState | null>;
  resolvedCardData: ResolvedCardData;
}): Types.EditCardState | null {
  if (!props.target) {
    return null;
  }

  return {
    ...props.resolvedCardData,
    target: props.target,
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
