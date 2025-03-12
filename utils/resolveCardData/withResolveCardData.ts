import * as Types from "./types";
import { produce } from "immer";
import withResolveCardDataRecipe, {
  withUpdateEditingDataItemRecipe,
} from "./withResolveCardDataRecipe";
import resolveCardData from "./resolveCardData";
import debugLog from "./debugLog";

const withResolveCardData: Types.WithResolveCardData = (initProps) => {
  let resetId = initProps?.resetId;
  let resolvedCardData: Types.ResolvedCardData = resolveCardData(initProps);

  debugLog("withResolveCardData init", { initProps, resolvedCardData });

  return {
    getResolvedCardData: () => resolvedCardData,
    updateEditingDataItem: (props) => {
      const newResolvedCardData = produce(
        resolvedCardData,
        withUpdateEditingDataItemRecipe(props),
      );

      debugLog("updateEditingDataItem", { props, newResolvedCardData });

      resolvedCardData = newResolvedCardData;

      return newResolvedCardData;
    },
    updateProps: (props, options) => {
      if (!!options?.reset || resetId !== props?.resetId) {
        resolvedCardData = resolveCardData(props);
      } else {
        const newResolvedCardData = produce(
          resolvedCardData,
          withResolveCardDataRecipe(props),
        );

        resolvedCardData = newResolvedCardData;
      }

      resetId = props?.resetId;

      debugLog("updateProps", resolvedCardData);

      return resolvedCardData;
    },
  };
};

export default withResolveCardData;
