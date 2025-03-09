import React from "react";
import {
  Picker as RNPicker,
  PickerProps as RNPickerProps,
  PickerItemProps as RNPickerItemProps,
} from "@react-native-picker/picker";
import { useThemeColors } from "@/hooks/useThemeColor";
import { Platform, StyleSheet, View, ViewStyle } from "react-native";
import { styles as buttonStyles } from "./Button";
import { useThemedTextStyle } from "./ThemedText";
import { styles as inputStyles } from "./TextInput";

export type PickerProps<T> = Omit<RNPickerProps<T>, "style"> & {
  style?: ViewStyle;
  pickerStyle?: RNPickerProps<T>["style"];
};

export type PickerItemProps<T> = RNPickerItemProps<T>;

function valueToPickerValue<T>(value: T): string | undefined {
  if (value === undefined) return undefined;

  return String(value);
}

function pickerValueToValue<T>(value: string): T {
  switch (value) {
    case "true":
      return true as T;
    case "false":
      return false as T;
    case "null":
      return null as T;
    default:
      return value as T;
  }
}

export function PickerItem<T>({
  value,
  style: styleProp,
  ...props
}: PickerItemProps<T>): React.ReactNode {
  const colors = useThemeColors();
  const textStyle = useThemedTextStyle({ type: "body1" });

  const style = React.useMemo(
    () =>
      StyleSheet.flatten([
        styles.item,
        textStyle,
        {
          backgroundColor: colors.background,
        },
        styleProp,
      ]),
    [colors, styleProp, textStyle],
  );

  return (
    <RNPicker.Item
      color={colors.text}
      {...props}
      style={style}
      value={valueToPickerValue(value)}
    />
  );
}

export default function Picker<T>({
  onValueChange: onValueChangeProp,
  style: styleProp,
  selectedValue: selectedValueProp,
  pickerStyle: pickerStyleProp,
  itemStyle: itemStyleProp,
  ...props
}: PickerProps<T>): React.ReactNode {
  const textStyle = useThemedTextStyle({ type: "body1" });
  const colors = useThemeColors();

  const style = React.useMemo(
    () =>
      StyleSheet.flatten([
        styles.container,
        {
          borderColor: colors.inputOutline,
          color: colors.text,
          backgroundColor: colors.background,
        },
        styleProp,
      ]),
    [colors, styleProp],
  );

  const pickerStyle = React.useMemo(
    () =>
      StyleSheet.flatten([
        styles.picker,
        textStyle,
        {
          backgroundColor: colors.background,
        },
        pickerStyleProp,
      ]),
    [colors, pickerStyleProp, textStyle],
  );

  const itemStyle = React.useMemo(
    () =>
      StyleSheet.flatten([
        styles.item,
        textStyle,
        {
          backgroundColor: colors.background,
        },
        itemStyleProp,
      ]),
    [colors, itemStyleProp, textStyle],
  );

  const onValueChange = React.useCallback<
    NonNullable<RNPickerProps<string>["onValueChange"]>
  >(
    (itemValue, itemIndex) => {
      onValueChangeProp?.(pickerValueToValue(itemValue), itemIndex);
    },
    [onValueChangeProp],
  );

  return (
    <View style={style}>
      <RNPicker<string>
        dropdownIconColor={colors.text}
        selectionColor={colors.link}
        {...props}
        selectedValue={valueToPickerValue(selectedValueProp)}
        onValueChange={onValueChange}
        style={pickerStyle}
        itemStyle={itemStyle}
      >
        {props.children}
      </RNPicker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: buttonStyles.outline.borderWidth,
    borderRadius: buttonStyles.button.borderRadius,
    overflow: "hidden",
  },
  picker: {
    padding: 0,
    margin:
      Platform.select({
        web: inputStyles.outlineInput.padding,
      }) ?? 0,
    borderColor: "transparent",
  },
  item: {
    padding: 0,
    margin: 0,
  },
});
