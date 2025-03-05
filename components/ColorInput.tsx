import React from "react";
import { View, StyleSheet, processColor } from "react-native";
import TextInput, { TextInputProps } from "./TextInput";
import IconSymbol from "./IconSymbol";

export type ColorInputProps = TextInputProps;

function getIsValidColor(color: string): boolean {
  const processed = processColor(color);

  return processed !== null && processed !== undefined;
}

export default function ColorInput(props: ColorInputProps): React.ReactNode {
  const isValidColor = props.value ? getIsValidColor(props.value) : null;

  const colorStyle = React.useMemo(
    () => [styles.color, { backgroundColor: props.value }],
    [props.value],
  );

  return (
    <TextInput
      rightAdornment={
        <View style={colorStyle}>
          {isValidColor ? null : <IconSymbol name="error" size={30} />}
        </View>
      }
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  color: {
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    // Web needs something here
    minWidth: 30,
  },
});
