import React from "react";
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
} from "react-native";

export interface TemplateSchemaItemProps {
  cardId: string;
  side: "front" | "back";
  templateId: string;
  templateSchemaItemId: string;
}

/**
 * NOTE: For performance we use internal state and broadcast the value out. This dramatically
 * improves the typing experience in cases where we're using context or some such to store quickly
 * changing data (e.g. showing cards edit in real time across form and display)
 */
export default function TextInput({
  value: valueProp,
  onChangeText: onChangeTextProp,
  ...props
}: RNTextInputProps) {
  const [value, setValue] = React.useState(valueProp);

  const onChangeText = React.useCallback(
    (newText: string) => {
      setValue(newText);
      onChangeTextProp?.(newText);
    },
    [onChangeTextProp],
  );

  React.useEffect(() => {
    // The value will already be set by the internal state, so most of the time we're calling this
    // with the same value, which is fine, react won't update again. But when the value changes
    // externally, it will update.
    setValue(valueProp);
  }, [valueProp]);

  return <RNTextInput {...props} value={value} onChangeText={onChangeText} />;
}
