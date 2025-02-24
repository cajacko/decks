import React from "react";
import Template from "./Template";
import { useAppSelector } from "@/store/hooks";
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
  const template = useAppSelector((state) =>
    selectCardTemplateData(state, props),
  );

  if (!template) {
    throw new Error(
      `CardTemplate: template not found for cardId ${props.cardId}`,
    );
  }

  const values = React.useMemo(
    () => templateDataToValues(template.data),
    [template.data],
  );

  const editValues = useEditCardTemplateValues(props);

  return <Template values={editValues ?? values} markup={template.markup} />;
}
