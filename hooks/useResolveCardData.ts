import React from "react";
import {
  withResolveCardData,
  ResolveCardDataProps,
  WithResolveCardDataReturn,
  ResolvedCardData,
  UpdateEditingDataItem,
} from "@/utils/resolveCardData";

export default function useResolveCardData(
  props: ResolveCardDataProps | null,
): WithResolveCardDataReturn & { resolvedCardData: ResolvedCardData } {
  const { cardData, deckDataSchema, templates, targetOrigin } = props ?? {};

  const [
    {
      getResolvedCardData,
      updateEditingDataItem: _updateEditingDataItem,
      updateProps: _updateProps,
    },
  ] = React.useState(() => withResolveCardData(props));

  const [resolvedCardData, setResolvedCardData] = React.useState(() =>
    getResolvedCardData(),
  );

  const updateEditingDataItem = React.useCallback<UpdateEditingDataItem>(
    (dataItem) => {
      const newState = _updateEditingDataItem(dataItem);

      setResolvedCardData(newState);

      return newState;
    },
    [_updateEditingDataItem],
  );

  const updateProps = React.useCallback(
    (newProps: ResolveCardDataProps | null): ResolvedCardData => {
      const newState = _updateProps(newProps);

      setResolvedCardData(newState);

      return newState;
    },
    [_updateProps],
  );

  const hasInitRef = React.useRef(false);

  React.useEffect(() => {
    if (!hasInitRef.current) {
      hasInitRef.current = true;

      return;
    }

    updateProps({
      targetOrigin: targetOrigin ?? null,
      cardData: cardData ?? null,
      deckDataSchema: deckDataSchema ?? null,
      templates: templates ?? null,
    });
  }, [cardData, deckDataSchema, templates, updateProps, targetOrigin]);

  return {
    getResolvedCardData,
    resolvedCardData,
    updateEditingDataItem,
    updateProps,
  };
}
