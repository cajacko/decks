import React from "react";
import Template, { DeckValues, Values } from "./Template";
import { useAppSelector, useRequiredAppSelector } from "@/store/hooks";
import {
  DeckOrCardSideProps,
  selectCardTemplateData,
  selectCardTemplate,
  selectDeck,
  cardOrDeckKey,
} from "@/store/combinedSelectors/cards";
import { useEditCardSideState } from "@/context/EditCard";
// TODO: Can this be deleted?
// import templateDataToValues from "@/components/Template/templateDataToValues";
import { Cards } from "@/store/types";
import { Target } from "@/utils/cardTarget";
import deckNameWithFallback from "@/utils/deckNameWithFallback";
import { createCachedSelector } from "re-reselect";
import { RootState } from "@/store/store";

export type CardTemplateProps = DeckOrCardSideProps;

function mergeWithDeckValues(
  values: Values | null | undefined,
  deckValues: DeckValues | null | undefined,
): Values | null {
  if (!values && !deckValues) return null;

  return {
    ...values,
    deck: deckValues,
  };
}

function useEditCardTemplateValues(
  side: Cards.Side,
  target: Target,
  deckValues: DeckValues,
): Values | null {
  const values = useEditCardSideState(side, target);

  return React.useMemo<Values | null>(
    () => (values ? mergeWithDeckValues(values, deckValues) : null),
    [values, deckValues],
  );
}

// Custom selectors just for this component, this ensures our value references stay the same when
// unmounting components. If we compiled these in memo's we loose all our references when we
// navigate away. And these references are used to determine if we need to recompile the template.
// And these can be costly to recompile.

const selectDeckValues = createCachedSelector(
  (state: RootState, props: Target) => selectDeck(state, props)?.name,
  (deckName): DeckValues | null =>
    deckName
      ? {
          name: deckNameWithFallback(deckName),
        }
      : null,
)((_, props) => `${props.type}:${props.id}`);

const selectCardTemplateValues = createCachedSelector(
  selectCardTemplateData,
  selectDeckValues,
  mergeWithDeckValues,
)(cardOrDeckKey);

export default function CardTemplate(
  props: CardTemplateProps,
): React.ReactNode {
  const deckValues = useAppSelector((state) => selectDeckValues(state, props));
  const savedValues = useAppSelector((state) =>
    selectCardTemplateValues(state, props),
  );

  const markup = useRequiredAppSelector(
    (state) => selectCardTemplate(state, props)?.markup,
    selectCardTemplate.name,
  );

  const editValues = useEditCardTemplateValues(props.side, props, deckValues);

  const values = editValues ?? savedValues;

  return <Template values={values} markup={markup} />;
}
