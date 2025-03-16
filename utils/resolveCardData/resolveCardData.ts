import * as Types from "./types";
import withResolveCardDataRecipe from "./withResolveCardDataRecipe";

export function getInitialResolvedCardData(): Types.ResolvedCardData {
  const resolvedCardData: Types.ResolvedCardData = {
    targetOrigin: null,
    dataByCardDataId: {
      back: {},
      front: {},
    },
    dataIdByTemplateDataId: {
      back: {},
      front: {},
    },
    resolvedDataValues: {
      back: {},
      front: {},
    },
    _debugCount: 0,
  };

  return resolvedCardData;
}

// Our selector for the card template would use this
export default function resolveCardData(
  props: Types.ResolveCardDataProps | null,
): Types.ResolvedCardData {
  const resolvedCardData: Types.ResolvedCardData = getInitialResolvedCardData();

  withResolveCardDataRecipe(props)(resolvedCardData);

  return resolvedCardData;
}
