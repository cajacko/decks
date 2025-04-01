import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { UserSettings } from "@/store/types";
import Picker, { PickerItem } from "@/components/forms/Picker";
import {
  selectUserSettingsFlag,
  setUserFlag,
} from "@/store/slices/userSettings";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import text from "@/constants/text";
import Field from "@/components/forms/Field";
import FieldSet from "@/components/forms/FieldSet";
import { dateToDateString } from "@/utils/dates";
import useFlag from "@/hooks/useFlag";

function Flag(props: { flagKey: UserSettings.FlagKey; style?: ViewStyle }) {
  const dispatch = useAppDispatch();
  const userSettingsValue = useAppSelector((state) =>
    selectUserSettingsFlag(state, { key: props.flagKey }),
  );
  const implementedValue = useFlag(props.flagKey);
  const values = UserSettings.flagMap[props.flagKey];

  return (
    <Field
      style={props.style}
      label={`${props.flagKey}\n(${String(implementedValue)})`}
    >
      <Picker
        selectedValue={userSettingsValue}
        iosButtonTitle={String(userSettingsValue)}
        onValueChange={(value) =>
          dispatch(
            setUserFlag({
              key: props.flagKey,
              value,
              date: dateToDateString(new Date()),
            }),
          )
        }
      >
        <PickerItem label="null" value={null} />
        {values.map((value) => (
          <PickerItem key={String(value)} label={String(value)} value={value} />
        ))}
      </Picker>
    </Field>
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
    <FieldSet collapsible initialCollapsed title={text["settings.flags.title"]}>
      {children}
    </FieldSet>
  );
}

const styles = StyleSheet.create({
  listItem: {
    marginBottom: 10,
  },
});
