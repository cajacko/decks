import React from "react";
import Template, { Values } from "./Template";
import { useRequiredAppSelector } from "@/store/hooks";
import {
  DeckOrCardSideProps,
  selectCardTemplateData,
  selectCardTemplate,
} from "@/store/combinedSelectors/cards";
import { useEditCardSideState } from "@/context/EditCard";
import templateDataToValues from "@/components/Template/templateDataToValues";
import { Cards } from "@/store/types";

export type CardTemplateProps = DeckOrCardSideProps;

function useEditCardTemplateValues(side: Cards.Side): Values | null {
  const data = useEditCardSideState(side);

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
  const data = useRequiredAppSelector((state) =>
    selectCardTemplateData(state, props),
  );

  const markup = useRequiredAppSelector(
    (state) => selectCardTemplate(state, props)?.markup,
  );

  const values = React.useMemo(() => templateDataToValues(data), [data]);

  const editValues = useEditCardTemplateValues(props.side);

  return <Template values={editValues ?? values} markup={markup} />;
}
