import React from "react";
import { View, Text, StyleSheet } from "react-native";
import TextInput from "@/components/TextInput";
import { useAppSelector } from "@/store/hooks";
import { selectTemplateSchemaItem } from "@/store/slices/templates";
import { useEditCardTemplateSchemaItem } from "@/context/EditCard";
import { Templates } from "@/store/types";

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

  const { onChange, validatedValue, placeholder, hasChanges } =
    useEditCardTemplateSchemaItem(props);

  const onChangeText = React.useCallback(
    (text: string) => {
      switch (validatedValue.type) {
        case Templates.DataType.Text:
        case Templates.DataType.Color:
          onChange({ value: text, type: validatedValue.type });
          break;
        default:
          return;
      }
    },
    [onChange, validatedValue.type],
  );

  const input = React.useMemo(() => {
    switch (validatedValue.type) {
      case Templates.DataType.Text:
      case Templates.DataType.Color: {
        return (
          <TextInput
            style={styles.input}
            value={validatedValue.value}
            onChangeText={onChangeText}
            placeholder={placeholder}
          />
        );
      }
      default:
        return null;
    }
  }, [validatedValue, onChangeText, placeholder]);

  if (!input) {
    throw new Error(
      `We do not have an TemplateSchemaItem input set up for this data type: ${validatedValue.type}`,
    );
  }

  return (
    <View>
      <Text style={styles.label}>
        {schemaItem.name}
        {hasChanges ? " (changed)" : ""}
      </Text>
      {input}
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
