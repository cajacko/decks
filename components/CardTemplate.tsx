import React from "react";
import Template, { Values } from "./Template";
import { useAppSelector, useRequiredAppSelector } from "@/store/hooks";
import {
  DeckOrCardSideProps,
  selectCardTemplateData,
  selectCardTemplate,
} from "@/store/combinedSelectors/cards";
import { useEditCardSideState } from "@/context/EditCard";
import templateDataToValues from "@/components/Template/templateDataToValues";
import { Cards } from "@/store/types";
import { Target } from "@/utils/cardTarget";

export type CardTemplateProps = DeckOrCardSideProps;

function useEditCardTemplateValues(
  side: Cards.Side,
  target: Target,
): Values | null {
  const data = useEditCardSideState(side, target);

  return React.useMemo<Values | null>(() => {
    if (!data) return null;

    const values: Values = {};

    for (const key in data) {
      const prop = data[key];

      if (prop) {
        values[key] = prop.editValue;
      }
    }

    return values;
  }, [data]);
}

export default function CardTemplate(
  props: CardTemplateProps,
): React.ReactNode {
  const data = useAppSelector((state) => selectCardTemplateData(state, props));

  const markup = useRequiredAppSelector(
    (state) => selectCardTemplate(state, props)?.markup,
    selectCardTemplate.name,
  );

  const values = React.useMemo(
    () => (data ? templateDataToValues(data) : null),
    [data],
  );

  const editValues = useEditCardTemplateValues(props.side, props);

  return <Template values={editValues ?? values} markup={markup} />;
}
