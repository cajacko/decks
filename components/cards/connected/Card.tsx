import React from "react";
import UICard, { CardProps as UICardProps } from "@/components/cards/ui/Card";
import { Target } from "@/utils/cardTarget";
import {
  useCardContainerSizeProps,
  UseCardContainerSizeProps,
} from "./CardContainer";
import { useAppSelector } from "@/store/hooks";
import {
  selectCardTemplateData,
  selectDeck,
  cardOrDeckKey,
  selectCardTemplate,
} from "@/store/combinedSelectors/cards";
import deckNameWithFallback from "@/utils/deckNameWithFallback";
import { createCachedSelector } from "re-reselect";
import { RootState } from "@/store/store";
import { Cards } from "@/store/types";
import { CardPhysicalSizeProvider } from "../context/CardPhysicalSize";

export interface ConnectedCardProps
  extends Pick<UseCardContainerSizeProps, "shadow"> {
  target: Target;
  side: Cards.Side;
  values?: UICardProps["values"];
}

export interface CardProps
  extends ConnectedCardProps,
    Partial<
      Omit<
        UICardProps,
        "deckValues" | "markup" | "values" | "shadow" | "cardSideCacheKey"
      >
    > {}

// Custom selectors just for this component, this ensures our value references stay the same when
// unmounting components. If we compiled these in memo's we loose all our references when we
// navigate away. And these references are used to determine if we need to recompile the template.
// And these can be costly to recompile.
const selectDeckValues = createCachedSelector(
  (state: RootState, props: Target) => selectDeck(state, props)?.name,
  (deckName): UICardProps["deckValues"] =>
    deckName
      ? {
          name: deckNameWithFallback(deckName),
        }
      : null,
)(cardOrDeckKey);

export function useCardProps<P extends Partial<UICardProps>>({
  target,
  shadow,
  side,
  values: valuesProp,
  ...uiCardProps
}: ConnectedCardProps & Omit<P, "shadow">): UICardProps {
  const cardSize = useCardContainerSizeProps({
    target,
    shadow,
    debugLocation: useCardProps.name,
  });

  const deckValues = useAppSelector((state) => selectDeckValues(state, target));

  const markup =
    useAppSelector(
      (state) => selectCardTemplate(state, { ...target, side })?.markup,
    ) ?? null;

  const values =
    useAppSelector((state) =>
      valuesProp
        ? valuesProp
        : selectCardTemplateData(state, { ...target, side }),
    ) ?? null;

  return {
    cardSideCacheKey: cardOrDeckKey(null, { ...target, side }),
    deckValues,
    markup,
    values,
    ...cardSize,
    ...uiCardProps,
    shadow: cardSize.shadow,
  };
}

export default function Card(props: CardProps): React.ReactNode {
  const uiCardProps = useCardProps(props);

  return (
    <CardPhysicalSizeProvider target={props.target} debugLocation={Card.name}>
      <UICard {...uiCardProps} />
    </CardPhysicalSizeProvider>
  );
}
