/**
 * NOTE: We had some issues with falsey values, so we now convert everything to json strings and
 * then parse that back. We also only allow passing of an items array so we can be very opinionated
 * about how we handle the values and select items. There's quite a few issues and caveats with
 * @react-native-picker/picker so it may be better to build our own at some point.
 */

import React from "react";
import {
  Picker as RNPicker,
  PickerProps as RNPickerProps,
  PickerItemProps as RNPickerItemProps,
} from "@react-native-picker/picker";
import { useThemeColors } from "@/hooks/useThemeColor";
import { Platform, StyleSheet, View, ViewStyle } from "react-native";
import { styles as buttonStyles } from "./Button";
import { useThemedTextStyle } from "../ui/ThemedText";
import { styles as inputStyles } from "./TextInput";
import Modal, { styles as modalStyles } from "../overlays/Modal";
import ThemedView from "../ui/ThemedView";
import { styles as alertStyles } from "../overlays/Alert";
import Button from "./Button";
import { Pressable } from "@/components/ui/Pressables";

export type PickerValue = string | number | boolean | null;

export type PickerProps<T extends PickerValue> = Omit<
  RNPickerProps<string>,
  "style" | "selectedValue" | "onValueChange" | "children"
> & {
  style?: ViewStyle;
  selectedValue: T;
  onValueChange?: (itemValue: T, itemIndex: number) => void;
  pickerStyle?: RNPickerProps<string>["style"];
  iosButtonTitle?: string;
  items: PickerItemProps<T>[];
};

interface PickerItemProps<T extends PickerValue>
  extends Omit<RNPickerItemProps<T>, "value" | "key" | "label"> {
  label: string;
  value: T;
  key?: string;
}

function valueToPickerValue<T extends PickerValue>(value: T): string {
  return JSON.stringify({ value });
}

function pickerValueToValue<T extends PickerValue>(value: string): T {
  return JSON.parse(value).value;
}

function PickerItem({
  style: styleProp,
  ...props
}: PickerItemProps<string>): React.ReactNode {
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

  return <RNPicker.Item color={colors.text} {...props} style={style} />;
}

export default function Picker<T extends PickerValue>({
  onValueChange: onValueChangeProp,
  style: styleProp,
  iosButtonTitle,
  selectedValue: selectedValueProp,
  pickerStyle: pickerStyleProp,
  itemStyle: itemStyleProp,
  items,
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

  const [open, setOpen] = React.useState(false);

  const onValueChange = React.useCallback<
    NonNullable<RNPickerProps<string>["onValueChange"]>
  >(
    (itemValue, itemIndex) => {
      onValueChangeProp?.(pickerValueToValue(itemValue), itemIndex);
      setOpen(false);
    },
    [onValueChangeProp],
  );

  const selectedValueString = valueToPickerValue(selectedValueProp);

  const { children, selectedItemLabel } = React.useMemo(() => {
    let selectedItemLabel: string | undefined;

    const children = items.map(
      ({ value: itemValue, key, label, ...itemProps }) => {
        const itemValueString = valueToPickerValue(itemValue);

        if (selectedValueString === itemValueString) {
          selectedItemLabel = label;
        }

        return (
          <PickerItem
            value={itemValueString}
            key={key ?? itemValueString}
            label={label}
            {...itemProps}
          />
        );
      },
    );

    return { children, selectedItemLabel };
  }, [items, selectedValueString]);

  const picker = (
    <RNPicker<string>
      dropdownIconColor={colors.text}
      mode="dialog"
      {...props}
      selectedValue={selectedValueString}
      onValueChange={onValueChange}
      style={pickerStyle}
      itemStyle={itemStyle}
    >
      {children}
    </RNPicker>
  );

  const closeModal = React.useCallback(() => setOpen(false), []);
  const openModal = React.useCallback(() => setOpen(true), []);

  const iosModalStyle = React.useMemo(
    () =>
      StyleSheet.flatten([
        modalStyles.content,
        alertStyles.modalView,
        styles.iosModalContainer,
      ]),
    [],
  );

  if (Platform.OS === "ios") {
    return (
      <View style={styleProp}>
        <Button
          title={iosButtonTitle ?? selectedItemLabel ?? ""}
          variant="outline"
          onPress={openModal}
          rightIcon="arrow-drop-down"
          ThemedTextProps={ThemedTextProps}
        />
        <Modal visible={open} onRequestClose={closeModal}>
          <View style={alertStyles.centeredView}>
            <ThemedView style={iosModalStyle}>{picker}</ThemedView>
            <Pressable
              onPress={closeModal}
              style={modalStyles.backgroundLight}
            />
          </View>
        </Modal>
      </View>
    );
  }

  return <View style={style}>{picker}</View>;
}

const styles = StyleSheet.create({
  iosButtonText: {
    textTransform: "none",
    textAlign: "left",
  },
  container: {
    borderWidth: buttonStyles.outline.borderWidth,
    borderRadius: buttonStyles.buttonContentContainer.borderRadius,
    overflow: "hidden",
  },
  iosModalContainer: {
    padding: 0,
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

const ThemedTextProps = {
  style: styles.iosButtonText,
};
