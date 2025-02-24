import React from "react";
import { View, Text, StyleSheet } from "react-native";
import TextInput from "@/components/TextInput";
import { useAppSelector } from "@/store/hooks";
import { selectTemplateSchemaItem } from "@/store/slices/templates";
import { useEditCardTemplateSchemaItem } from "@/context/EditCard";

export interface TemplateSchemaItemProps {
  cardId: string;
  side: "front" | "back";
  templateId: string;
  templateSchemaItemId: string;
}

export default function TemplateSchemaItem(props: TemplateSchemaItemProps) {
  const schemaItem = useAppSelector((state) =>
    selectTemplateSchemaItem(state, props),
  );

  if (!schemaItem) {
    throw new Error(`Schema item not found: ${props.templateSchemaItemId}`);
  }

  const {
    onChange,
    value: { type, value },
    placeholder,
  } = useEditCardTemplateSchemaItem(props);

  const onChangeText = React.useCallback(
    (text: string) => {
      onChange({ value: text, type });
    },
    [onChange, type],
  );

  return (
    <View>
      <Text style={styles.label}>{schemaItem.name}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginBottom: 16,
  },
});
