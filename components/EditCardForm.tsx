import React from "react";
import { View, Button } from "react-native";
import { useAppSelector } from "@/store/hooks";
import { selectCardTemplate } from "@/store/combinedSelectors/cards";
import TemplateSchemaItem from "@/components/TemplateSchemaItem";
import { useSaveEditCard, useHasEditCardChanges } from "@/context/EditCard";
import { CardOrDeckId } from "@/utils/cardOrDeck";

export type EditCardFormProps = CardOrDeckId;

export default function EditCardForm(
  props: EditCardFormProps,
): React.ReactNode {
  const backTemplate = useAppSelector((state) =>
    selectCardTemplate(state, { ...props, side: "back" }),
  );

  const frontTemplate = useAppSelector((state) =>
    selectCardTemplate(state, { ...props, side: "front" }),
  );

  const save = useSaveEditCard();
  const hasChanges = useHasEditCardChanges();

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
      <Button title="Save" onPress={save} disabled={!hasChanges} />
    </View>
  );
}
