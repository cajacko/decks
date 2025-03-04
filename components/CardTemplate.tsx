import React from "react";
import Template, { DeckValues, Values } from "./Template";
import { useAppSelector, useRequiredAppSelector } from "@/store/hooks";
import {
  DeckOrCardSideProps,
  selectCardTemplateData,
  selectCardTemplate,
  selectDeck,
} from "@/store/combinedSelectors/cards";
import { useEditCardSideState } from "@/context/EditCard";
import templateDataToValues from "@/components/Template/templateDataToValues";
import { Cards } from "@/store/types";
import { Target } from "@/utils/cardTarget";
import deckNameWithFallback from "@/utils/deckNameWithFallback";

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
        values[key] = prop.editValue;
      }
    }

    return values;
  }, [data, deckValues]);
}

export default function CardTemplate(
  props: CardTemplateProps,
): React.ReactNode {
  const deckName = useAppSelector((state) => selectDeck(state, props))?.name;
  const data = useAppSelector((state) => selectCardTemplateData(state, props));

  const deckValues = React.useMemo<DeckValues>(
    () =>
      deckName
        ? {
            name: deckNameWithFallback(deckName),
          }
        : null,
    [deckName],
  );

  const markup = useRequiredAppSelector(
    (state) => selectCardTemplate(state, props)?.markup,
    selectCardTemplate.name,
  );

  const values = React.useMemo(
    () => (data ? templateDataToValues(data, deckValues) : null),
    [data, deckValues],
  );

  const editValues = useEditCardTemplateValues(props.side, props, deckValues);

  return <Template values={editValues ?? values} markup={markup} />;
}
