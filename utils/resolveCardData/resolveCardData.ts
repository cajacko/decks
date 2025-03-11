import * as Types from "./types";
import withResolveCardDataRecipe from "./withResolveCardDataRecipe";

// Our selector for the card template would use this
export default function resolveCardData(
  props: Types.ResolveCardDataProps | null,
): Types.ResolvedCardData {
  const resolvedCardData: Types.ResolvedCardData = {
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
    hasChanges: null,
    _debugCount: 0,
  };

  withResolveCardDataRecipe(props)(resolvedCardData);

  return resolvedCardData;
}
