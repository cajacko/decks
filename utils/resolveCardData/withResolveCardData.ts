import * as Types from "./types";
import { produce } from "immer";
import withResolveCardDataRecipe, {
  withUpdateEditingDataItemRecipe,
} from "./withResolveCardDataRecipe";
import resolveCardData from "./resolveCardData";
import debugLog from "./debugLog";
import { cloneDeep } from "lodash";

const withResolveCardData: Types.WithResolveCardData = (initProps) => {
  let resolvedCardData: Types.ResolvedCardData = resolveCardData(initProps);

  debugLog("withResolveCardData ini", { initProps, resolvedCardData });

  return {
    getResolvedCardData: () => resolvedCardData,
    updateEditingDataItem: (props) => {
      const newResolvedCardData = produce(
        resolvedCardData,
        withUpdateEditingDataItemRecipe(props),
      );

      debugLog("updateEditingDataItem", { props, newResolvedCardData });

      resolvedCardData = newResolvedCardData;

      return cloneDeep(newResolvedCardData);
    },
    updateProps: (props) => {
      const newResolvedCardData = produce(
        resolvedCardData,
        withResolveCardDataRecipe(props),
      );

      debugLog("updateProps", { props, newResolvedCardData });

      resolvedCardData = newResolvedCardData;

      return cloneDeep(newResolvedCardData);
    },
  };
};

export default withResolveCardData;
