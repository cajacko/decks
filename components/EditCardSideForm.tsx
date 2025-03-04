import React from "react";
import { StyleSheet } from "react-native";
import TemplateSchemaItem from "@/components/TemplateSchemaItem";
import { Cards, Templates } from "@/store/types";
import { useAppSelector } from "@/store/hooks";
import { selectTemplateSchemaOrder } from "@/store/combinedSelectors/cards";
import { Target } from "@/utils/cardTarget";
import ThemedText from "./ThemedText";

export default function EditCardSideForm(
  props: Target & {
    templateId: Templates.TemplateId;
    title: string | null;
    side: Cards.Side;
  },
) {
  const schemaOrder = useAppSelector((state) =>
    selectTemplateSchemaOrder(state, props),
  );

  if (!schemaOrder || schemaOrder.length === 0) return null;

  return (
    <>
      {props.title !== null && (
        <ThemedText type="h3" style={styles.title}>
          {props.title}
        </ThemedText>
      )}
      {schemaOrder.map((templateSchemaItemId) => (
        <TemplateSchemaItem
          key={templateSchemaItemId}
          templateSchemaItemId={templateSchemaItemId}
          templateId={props.templateId}
          side={props.side}
          style={styles.item}
        />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 20,
  },
  item: {
    marginBottom: 10,
  },
});
