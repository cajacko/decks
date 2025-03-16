import React from "react";
import * as Types from "./EditCard.types";
import { Target } from "@/utils/cardTarget";
import AppError from "@/classes/AppError";
import { ResolvedCardData } from "@/utils/resolveCardData";
import { getHasChanges } from "./getUpdateCardData";

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
    getHasChanges: () => {
      if (!props.stateRef.current) {
        new AppError(
          "getHasChanges called before state was initialised in EditCardProvider",
        ).log("error");

        return false;
      }

      const { back, front } = props.stateRef.current.dataByCardDataId;

      for (const cardDataId in back) {
        const dataItem = back[cardDataId];

        if (!dataItem) continue;

        if (getHasChanges(dataItem)) {
          return true;
        }
      }

      for (const cardDataId in front) {
        const dataItem = front[cardDataId];

        if (!dataItem) continue;

        if (getHasChanges(dataItem)) {
          return true;
        }
      }

      return false;
    },
  };
}
