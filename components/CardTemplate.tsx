import React from "react";
import Template from "./Template";
import { useRequiredAppSelector } from "@/store/hooks";
import {
  selectCardTemplateData,
  selectCardTemplate,
} from "@/store/combinedSelectors/cards";
import { useEditCardTemplateValues } from "@/context/EditCard";
import templateDataToValues from "@/components/Template/templateDataToValues";

export interface CardTemplateProps {
  cardId: string;
  side: "front" | "back";
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

  const editValues = useEditCardTemplateValues(props);

  return <Template values={editValues ?? values} markup={markup} />;
}
