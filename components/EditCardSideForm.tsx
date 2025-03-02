import React from "react";
import { StyleSheet, Text } from "react-native";
import TemplateSchemaItem from "@/components/TemplateSchemaItem";
import { Cards, Templates } from "@/store/types";
import { useAppSelector } from "@/store/hooks";
import { selectTemplateSchemaOrder } from "@/store/combinedSelectors/cards";
import { Target } from "@/utils/cardTarget";

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
      {props.title !== null && <Text style={styles.title}>{props.title}</Text>}
      {schemaOrder.map((templateSchemaItemId) => (
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

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
});
