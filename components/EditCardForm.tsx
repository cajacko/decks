import React from "react";
import { View, Button, StyleSheet, Text } from "react-native";
import { useAppSelector } from "@/store/hooks";
import { selectCardTemplate } from "@/store/combinedSelectors/cards";
import TemplateSchemaItem from "@/components/TemplateSchemaItem";
import { useSaveEditCard } from "@/context/EditCard";
import { Target } from "@/utils/cardTarget";
import { Cards, Templates } from "@/store/types";

export type EditCardFormProps = Target & {
  flipSide: () => void;
};

function SideTemplateForm(props: {
  templateId: Templates.TemplateId;
  schemaOrder: Templates.DataItemId[];
  title: string | null;
  side: Cards.Side;
}) {
  if (props.schemaOrder.length === 0) return null;

  return (
    <>
      {props.title !== null && <Text style={styles.title}>{props.title}</Text>}
      {props.schemaOrder.map((templateSchemaItemId) => (
        <TemplateSchemaItem
          key={templateSchemaItemId}
          templateSchemaItemId={templateSchemaItemId}
          templateId={props.templateId}
          side={props.side}
        />
      ))}
    </>
  );
}

export default function EditCardForm({
  flipSide,
  ...target
}: EditCardFormProps): React.ReactNode {
  const backTemplate = useAppSelector((state) =>
    selectCardTemplate(state, { ...target, side: "back" }),
  );

  const frontTemplate = useAppSelector((state) =>
    selectCardTemplate(state, { ...target, side: "front" }),
  );

  useSaveEditCard(true);

  return (
    <View style={styles.container}>
      <View style={styles.flipButton}>
        <Button title="Flip Card" onPress={flipSide} />
      </View>
      {frontTemplate && (
        <SideTemplateForm
          {...target}
          side="front"
          schemaOrder={frontTemplate.schemaOrder}
          templateId={frontTemplate.templateId}
          title={!!backTemplate ? "Front Side" : null}
        />
      )}
      {backTemplate && (
        <SideTemplateForm
          {...target}
          side="back"
          schemaOrder={backTemplate.schemaOrder}
          templateId={backTemplate.templateId}
          title={!!frontTemplate ? "Back Side" : null}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  flipButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
});
