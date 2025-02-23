import React from "react";
import Template from "./Template";
import { useAppSelector } from "@/store/hooks";
import { selectCardTemplateData } from "@/store/combinedSelectors/cards";

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

  return <Template data={template.data} markup={template.markup} />;
}
