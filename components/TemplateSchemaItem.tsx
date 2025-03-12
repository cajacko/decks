import React from "react";
import { ViewStyle } from "react-native";
import TextInput from "@/components/TextInput";
import { useRequiredAppSelector } from "@/store/hooks";
import { selectTemplateSchemaItem } from "@/store/slices/templates";
import {
  useEditCardTemplateSchemaItem,
  useIsNewCard,
} from "@/context/EditCard";
import AppError from "@/classes/AppError";
import ColorInput from "./ColorInput";
import Field from "./Field";
import useFlag from "@/hooks/useFlag";
import text from "@/constants/text";
import { Cards } from "@/store/types";

export interface TemplateSchemaItemProps {
  side: Cards.Side;
  templateId: string;
  templateDataId: string;
  style?: ViewStyle;
}

export default function TemplateSchemaItem(props: TemplateSchemaItemProps) {
  const showMoreInfo = useFlag("EDIT_CARD_MORE_INFO") === "enabled";
  const isNewCard = useIsNewCard();
  const schemaItem = useRequiredAppSelector(
    (state) => selectTemplateSchemaItem(state, props),
    selectTemplateSchemaItem.name,
  );

  const fieldLabel: string = schemaItem.name;
  const fieldType = schemaItem.type;

  const { onChange, validatedValue, placeholder, hasChanges } =
    useEditCardTemplateSchemaItem(props);

  const onChangeText = React.useCallback(
    (text: string) => {
      switch (fieldType) {
        case "text":
        case "color":
          onChange({ value: text, type: fieldType, origin: "card" });
          break;
        default:
          return;
      }
    },
    [onChange, fieldType],
  );

  const handleUseDefaults = React.useMemo(() => {
    if (!showMoreInfo) return;

    return () => {
      onChange(undefined);
    };
  }, [showMoreInfo, onChange]);

  const handleSetNull = React.useMemo(() => {
    if (!showMoreInfo) return;

    return (isEnabled: boolean) => {
      onChange(
        isEnabled ? undefined : { value: null, type: "null", origin: "card" },
      );
    };
  }, [showMoreInfo, onChange]);

  const input = React.useMemo(() => {
    const nullText = text["general.null"];

    switch (fieldType) {
      case "text": {
        return (
          <TextInput
            value={
              validatedValue?.value === null
                ? nullText
                : String(validatedValue?.value ?? "")
            }
            onChangeText={onChangeText}
            placeholder={placeholder}
          />
        );
      }
      case "color": {
        return (
          <ColorInput
            value={
              validatedValue?.value === null
                ? nullText
                : String(validatedValue?.value ?? "")
            }
            onChangeText={onChangeText}
            placeholder={placeholder}
          />
        );
      }
      default:
        return null;
    }
  }, [validatedValue, onChangeText, placeholder, fieldType]);

  if (!input) {
    new AppError(
      `${TemplateSchemaItem.name}: We do not have an TemplateSchemaItem input set up for this data type: ${fieldType}, returning null`,
      validatedValue,
    ).log("error");

    return null;
  }

  let label = fieldLabel;

  // TODO: Do not show to end users
  if (showMoreInfo) {
    label = `${label} (${validatedValue?.origin ?? "N/A"})`;
  }

  return (
    <Field
      label={label}
      style={props.style}
      hasChanges={hasChanges && !isNewCard}
      handleClear={handleUseDefaults}
      handleChangeEnable={handleSetNull}
      showEnabled={showMoreInfo}
      enabled={validatedValue?.value !== null}
    >
      {input}
    </Field>
  );
}
