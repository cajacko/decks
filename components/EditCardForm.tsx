import React from "react";
import { View } from "react-native";
import { useAppSelector } from "@/store/hooks";
import { selectCardTemplate } from "@/store/combinedSelectors/cards";
import TemplateSchemaItem from "@/components/TemplateSchemaItem";
import { useSaveEditCard } from "@/context/EditCard";
import { Target } from "@/utils/cardTarget";

export type EditCardFormProps = Target;

export default function EditCardForm(
  props: EditCardFormProps,
): React.ReactNode {
  const backTemplate = useAppSelector((state) =>
    selectCardTemplate(state, { ...props, side: "back" }),
  );

  const frontTemplate = useAppSelector((state) =>
    selectCardTemplate(state, { ...props, side: "front" }),
  );

  useSaveEditCard(true);

  return (
    <View style={{ padding: 20 }}>
      {frontTemplate?.schemaOrder.map((templateSchemaItemId) => (
        <TemplateSchemaItem
          key={templateSchemaItemId}
          templateSchemaItemId={templateSchemaItemId}
          templateId={frontTemplate.templateId}
          side="front"
        />
      ))}
      {backTemplate?.schemaOrder.map((templateSchemaItemId) => (
        <TemplateSchemaItem
          key={templateSchemaItemId}
          templateSchemaItemId={templateSchemaItemId}
          templateId={backTemplate.templateId}
          side="back"
        />
      ))}
    </View>
  );
}
