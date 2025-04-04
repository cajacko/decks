import React from "react";
import { ViewStyle } from "react-native";
import TextInput from "@/components/forms/TextInput";
import { useRequiredAppSelector } from "@/store/hooks";
import { selectTemplateSchemaItem } from "@/store/selectors/templates";
import {
  useEditCardTemplateSchemaItem,
  useIsNewCard,
} from "@/context/EditCard";
import AppError from "@/classes/AppError";
import ColorInput from "../forms/ColorInput";
import Field from "../forms/Field";
import useFlag from "@/hooks/useFlag";
import text from "@/constants/text";
import { Cards } from "@/store/types";
import { FallbackValueOrigin } from "@/utils/resolveCardData";

export interface TemplateSchemaItemProps {
  side: Cards.Side;
  templateId: string;
  templateDataId: string;
  style?: ViewStyle;
}

const fallbackText: Record<FallbackValueOrigin, string> = {
  "deck-defaults": text["card.using_default.deck"],
  "template-map": text["card.using_default.template_mapping"],
  template: text["card.using_default.template"],
};

export default function TemplateSchemaItem(props: TemplateSchemaItemProps) {
  const showMoreInfo = useFlag("EDIT_CARD_MORE_INFO") === "enabled";
  const isNewCard = useIsNewCard();
  const schemaItem = useRequiredAppSelector(
    (state) => selectTemplateSchemaItem(state, props),
    selectTemplateSchemaItem.name,
  );

  const fieldLabel: string = schemaItem.name;
  const description = schemaItem.description;
  const fieldType = schemaItem.type;

  const {
    onChange,
    validatedValue,
    placeholder: _placeholder,
    hasChanges,
    usingFallback,
  } = useEditCardTemplateSchemaItem(props);

  const onChangeText = React.useCallback(
    (text: string) => {
      switch (fieldType) {
        case "text":
        case "color":
          onChange({ value: text, type: fieldType });
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
      onChange(isEnabled ? undefined : { value: null, type: "null" });
    };
  }, [showMoreInfo, onChange]);

  const input = React.useMemo(() => {
    let placeholder = _placeholder;

    if (validatedValue?.value === null && !placeholder) {
      placeholder = text["general.null"];
    }

    switch (fieldType) {
      case "text": {
        return (
          <TextInput
            value={String(validatedValue?.value ?? "")}
            onChangeText={onChangeText}
            placeholder={placeholder}
          />
        );
      }
      case "color": {
        return (
          <ColorInput
            value={String(validatedValue?.value ?? "")}
            onChangeText={onChangeText}
            placeholder={placeholder}
          />
        );
      }
      default:
        return null;
    }
  }, [validatedValue, onChangeText, _placeholder, fieldType]);

  if (!input) {
    new AppError(
      `${TemplateSchemaItem.name}: We do not have an TemplateSchemaItem input set up for this data type: ${fieldType}, returning null`,
      validatedValue,
    ).log("error");

    return null;
  }

  let subLabel = description;

  if (usingFallback && description) {
    subLabel = `${description}\n${fallbackText[usingFallback]}`;
  } else if (usingFallback) {
    subLabel = fallbackText[usingFallback];
  }

  return (
    <Field
      label={fieldLabel}
      style={props.style}
      hasChanges={hasChanges && !isNewCard}
      handleClear={handleUseDefaults}
      handleChangeEnable={handleSetNull}
      showEnabled={showMoreInfo}
      enabled={validatedValue?.value !== null}
      subLabel={subLabel ?? null}
    >
      {input}
    </Field>
  );
}
