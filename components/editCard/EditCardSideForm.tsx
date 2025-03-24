import React from "react";
import TemplateSchemaItem from "@/components/editCard/TemplateSchemaItem";
import { Cards, Templates } from "@/store/types";
import { useAppSelector } from "@/store/hooks";
import { selectTemplateSchemaOrder } from "@/store/combinedSelectors/cards";
import { Target } from "@/utils/cardTarget";
import FieldSet from "../forms/FieldSet";

export default function EditCardSideForm(
  props: Target & {
    templateId: Templates.Id;
    title: string | null;
    side: Cards.Side;
  },
) {
  const schemaOrder = useAppSelector((state) =>
    selectTemplateSchemaOrder(state, props),
  );

  if (!schemaOrder || schemaOrder.length === 0) return null;

  return (
    <FieldSet title={props.title} itemSpacing={15}>
      {schemaOrder.map((templateDataId) => (
        <TemplateSchemaItem
          key={templateDataId}
          templateDataId={templateDataId}
          templateId={props.templateId}
          side={props.side}
        />
      ))}
    </FieldSet>
  );
}
