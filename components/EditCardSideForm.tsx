import React from "react";
import { StyleSheet, Text } from "react-native";
import TemplateSchemaItem from "@/components/TemplateSchemaItem";
import { Cards, Templates } from "@/store/types";

export default function EditCardSideForm(props: {
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

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
});
