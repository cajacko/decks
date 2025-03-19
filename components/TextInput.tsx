import React from "react";
import {
  Platform,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  StyleSheet,
  View,
  ViewProps,
} from "react-native";
import { ThemedTextVariant, useThemedTextStyle } from "./ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { styles as buttonStyles } from "@/components/Button";

type Variant = "display" | "outline";

export interface TextInputProps
  extends Omit<RNTextInputProps, "style">,
    Pick<ViewProps, "style"> {
  textInputStyle?: RNTextInputProps["style"];
  textVariant?: ThemedTextVariant;
  /**
   * display - Shows like it's normal text but can be edited
   * outline - Shows like a normal input field
   */
  variant?: Variant;
  rightAdornment?: React.ReactNode;
}

/**
 * NOTE: For performance we use internal state and broadcast the value out. This dramatically
 * improves the typing experience in cases where we're using context or some such to store quickly
 * changing data (e.g. showing cards edit in real time across form and display)
 */
export default function TextInput({
  value: valueProp,
  onChangeText: onChangeTextProp,
  style: styleProp,
  textVariant = "body1",
  variant = "outline",
  rightAdornment,
  textInputStyle: textInputStyleProp,
  multiline,
  ...props
}: TextInputProps) {
  const placeholderColor = useThemeColor("placeholder");
  const borderColor = useThemeColor("inputOutline");
  const textStyle = useThemedTextStyle({ type: textVariant });
  const [value, setValue] = React.useState(valueProp);

  const style = React.useMemo(
    () =>
      StyleSheet.flatten([
        styles.container,
        styles[variant],
        variant === "outline" && { borderColor },
        styleProp,
      ]),
    [styleProp, variant, borderColor],
  );

  const inputVariant: `${Variant}Input` = `${variant}Input`;

  const textInputStyle = React.useMemo(
    () =>
      StyleSheet.flatten([
        textStyle,
        styles.input,
        styles[inputVariant],
        textInputStyleProp,
        !multiline && Platform.OS === "ios" && { lineHeight: "normal" },
      ]),
    [textInputStyleProp, inputVariant, textStyle, multiline],
  );

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

  return (
    <View style={style}>
      <RNTextInput
        {...props}
        multiline={multiline}
        style={textInputStyle}
        value={value ?? ""}
        onChangeText={onChangeText}
        placeholderTextColor={placeholderColor}
      />
      {rightAdornment}
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  input: {
    flex: 1,
  },
  display: {},
  outline: {
    borderWidth: buttonStyles.outline.borderWidth,
    borderRadius: buttonStyles.button.borderRadius,
    overflow: "hidden",
  },
  outlineInput: {
    padding: 8,
  },
  displayInput: {},
});
