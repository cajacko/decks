import React from "react";
import CardContainer, { CardContainerProps } from "./CardContainer";
import Template, { TemplateProps } from "@/components/Template";
import withUseExternalMemo from "@/hooks/withUseExternalMemo";

/**
 * Special non card variables the templates can access e.g. the deck name.
 * Could potentially add things in the future e.g. expansion variables etc. Things that you wouldn't
 * want to clutter the card data schemas with
 */
export type DeckValues = {
  name: string;
};

export interface CardProps extends CardContainerProps {
  // Force us to add this prop or explicitly set to null, would be easy to forget otherwise
  deckValues: DeckValues | null;
  markup: Required<TemplateProps>["markup"] | null;
  values: Required<TemplateProps>["values"] | null;
  cardSideCacheKey: string;
  skeleton?: boolean;
}

// If we compiled these in normal memo's we loose all our references when we
// navigate away. And these references are used to determine if we need to recompile the template.
// And these can be costly to recompile.
const { useExternalMemo } = withUseExternalMemo<TemplateProps["values"]>();

export default function Card({
  deckValues,
  markup,
  values: valuesProp,
  cardSideCacheKey,
  skeleton = false,
  ...cardContainerProps
}: CardProps): React.ReactNode {
  const values = useExternalMemo(
    () => ({
      ...valuesProp,
      deck: deckValues,
    }),
    [valuesProp, deckValues],
    cardSideCacheKey,
  );

  return (
    <CardContainer {...cardContainerProps}>
      {markup && !skeleton && <Template values={values} markup={markup} />}
    </CardContainer>
  );
}
