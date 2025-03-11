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
import templateDataToValues from "@/components/Template/templateDataToValues";
import { Cards } from "@/store/types";
import { Target } from "@/utils/cardTarget";
import deckNameWithFallback from "@/utils/deckNameWithFallback";
import { createCachedSelector } from "re-reselect";
import { RootState } from "@/store/store";

export type CardTemplateProps = DeckOrCardSideProps;

function useEditCardTemplateValues(
  side: Cards.Side,
  target: Target,
  deckValues: DeckValues,
): Values | null {
  const data = useEditCardSideState(side, target);

  return React.useMemo<Values | null>(() => {
    if (!data) return null;

    const values: Values = {
      deck: deckValues,
    };

    for (const key in data) {
      const prop = data[key];

      if (prop) {
        values[key] = prop.editValidatedValue?.value;
      }
    }

    return values;
  }, [data, deckValues]);
}

// Custom selectors just for this component, this ensures our value references stay the same when
// unmounting components. If we compiled these in memo's we loose all our references when we
// navigate away. And these references are used to determine if we need to recompile the template.
// And these can be costly to recompile.

const selectDeckValues = createCachedSelector(
  (state: RootState, props: Target) => selectDeck(state, props)?.name,
  (deckName) =>
    deckName
      ? {
          name: deckNameWithFallback(deckName),
        }
      : null,
)((_, props) => `${props.type}:${props.id}`);

const selectCardTemplateValues = createCachedSelector(
  selectCardTemplateData,
  selectDeckValues,
  (data, deckValues) => (data ? templateDataToValues(data, deckValues) : null),
)(cardOrDeckKey);

export default function CardTemplate(
  props: CardTemplateProps,
): React.ReactNode {
  const deckValues = useAppSelector((state) => selectDeckValues(state, props));
  const values = useAppSelector((state) =>
    selectCardTemplateValues(state, props),
  );

  const markup = useRequiredAppSelector(
    (state) => selectCardTemplate(state, props)?.markup,
    selectCardTemplate.name,
  );

  const editValues = useEditCardTemplateValues(props.side, props, deckValues);

  return <Template values={editValues ?? values} markup={markup} />;
}
