import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { UserSettings } from "@/store/types";
import ThemedText from "../ThemedText";
import { Picker } from "@react-native-picker/picker";
import {
  selectUserSettingsFlag,
  setUserFlag,
} from "@/store/slices/userSettings";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { selectFlag } from "@/store/combinedSelectors/flags";
import { useThemeColors } from "@/hooks/useThemeColor";
import text from "@/constants/text";

function valueToPickerValue(
  value: UserSettings.FlagValue | null | undefined,
): string | undefined {
  if (value === undefined) return undefined;

  return String(value);
}

function pickerValueToValue(value: string): UserSettings.FlagValue | null {
  switch (value) {
    case "true":
      return true;
    case "false":
      return false;
    case "null":
      return null;
    default:
      return value as UserSettings.FlagValue;
  }
}

function Flag(props: { flagKey: UserSettings.FlagKey; style?: ViewStyle }) {
  const colors = useThemeColors();
  const dispatch = useAppDispatch();
  const userSettingsValue = useAppSelector((state) =>
    selectUserSettingsFlag(state, { key: props.flagKey }),
  );
  const implementedValue = useAppSelector((state) =>
    selectFlag(state, { key: props.flagKey }),
  );

  const values = UserSettings.flagMap[props.flagKey];

  const style = React.useMemo(
    () => ({
      color: colors.text,
      backgroundColor: colors.background,
    }),
    [colors],
  );

  return (
    <View style={props.style}>
      <ThemedText>
        {`${props.flagKey}\n(${String(implementedValue)})`}
      </ThemedText>
      <Picker
        selectedValue={valueToPickerValue(userSettingsValue)}
        dropdownIconColor={colors.text}
        selectionColor={colors.link}
        onValueChange={(itemValue) =>
          dispatch(
            setUserFlag({
              key: props.flagKey,
              value: pickerValueToValue(itemValue),
            }),
          )
        }
        style={style}
        itemStyle={style}
      >
        <Picker.Item
          label="null"
          value={valueToPickerValue(null)}
          style={style}
          color={colors.text}
        />
        {values.map((value) => (
          <Picker.Item
            key={String(value)}
            label={valueToPickerValue(value)}
            value={valueToPickerValue(value)}
            style={style}
            color={colors.text}
          />
        ))}
      </Picker>
    </View>
  );
}

export default function Flags(): React.ReactNode {
  const children = React.useMemo(
    () =>
      Object.keys(UserSettings.flagMap).map((key) => (
        <Flag
          key={key}
          flagKey={key as UserSettings.FlagKey}
          style={styles.listItem}
        />
      )),
    [],
  );

  return (
    <>
      <ThemedText style={styles.title} type="h3">
        {text["settings.flags.title"]}
      </ThemedText>
      {children}
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 10,
  },
  listItem: {
    marginBottom: 10,
  },
});
