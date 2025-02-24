import React from "react";
import Template from "./Template";
import { useRequiredAppSelector } from "@/store/hooks";
import { selectCardTemplateData } from "@/store/combinedSelectors/cards";
import { useEditCardTemplateValues } from "@/context/EditCard";
import templateDataToValues from "@/components/Template/templateDataToValues";

export interface CardTemplateProps {
  cardId: string;
  side: "front" | "back";
}

export default function CardTemplate(
  props: CardTemplateProps,
): React.ReactNode {
  const template = useRequiredAppSelector((state) =>
    selectCardTemplateData(state, props),
  );

  const values = React.useMemo(
    () => templateDataToValues(template.data),
    [template.data],
  );

  const editValues = useEditCardTemplateValues(props);

  return <Template values={editValues ?? values} markup={template.markup} />;
}
