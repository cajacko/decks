import React from "react";
import { ViewStyle } from "react-native";
import TextInput from "@/components/TextInput";
import { useAppSelector } from "@/store/hooks";
import { selectTemplateSchemaItem } from "@/store/slices/templates";
import {
  useEditCardTemplateSchemaItem,
  useIsNewCard,
} from "@/context/EditCard";
import { Templates } from "@/store/types";
import AppError from "@/classes/AppError";
import ColorInput from "./ColorInput";
import Field from "./Field";

export interface TemplateSchemaItemProps {
  side: "front" | "back";
  templateId: string;
  templateSchemaItemId: string;
  style?: ViewStyle;
}

export default function TemplateSchemaItem(props: TemplateSchemaItemProps) {
  const isNewCard = useIsNewCard();
  const schemaItemName = useAppSelector(
    (state) => selectTemplateSchemaItem(state, props)?.name,
  );

  // Log an error if we can't find the schema item name rather than throwing an error
  React.useEffect(() => {
    if (!schemaItemName) {
      new AppError(
        `${TemplateSchemaItem.name}: Could not find schema item name for template schema item id: ${props.templateSchemaItemId}`,
        props,
      ).log("error");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schemaItemName, props.templateSchemaItemId]);

  const fieldLabel: string = schemaItemName || props.templateSchemaItemId;

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
      case Templates.DataType.Text: {
        return (
          <TextInput
            value={validatedValue.value}
            onChangeText={onChangeText}
            placeholder={placeholder}
          />
        );
      }
      case Templates.DataType.Color: {
        return (
          <ColorInput
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
    new AppError(
      `${TemplateSchemaItem.name}: We do not have an TemplateSchemaItem input set up for this data type: ${validatedValue.type}, returning null`,
      validatedValue,
    ).log("error");

    return null;
  }

  return (
    <Field
      label={fieldLabel}
      style={props.style}
      hasChanges={hasChanges && !isNewCard}
    >
      {input}
    </Field>
  );
}
