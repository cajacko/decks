import React from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  selectUserSetting,
  setUserFlag,
  setUserSetting,
} from "@/store/slices/userSettings";
import Field from "./Field";
import Picker, { PickerItem } from "./Picker";
import { UserSettings } from "@/store/types";
import FieldSet, { FieldSetProps } from "./FieldSet";
import text from "@/constants/text";
import SwitchField from "./SwitchField";
import useFlag from "@/hooks/useFlag";

type Theme = NonNullable<UserSettings.UserSettingValue<"theme">>;

const titleProps = { type: "h2" } as const;

export interface SettingsAppProps extends FieldSetProps {
  closeDrawer: () => void;
}

export default function SettingsApp(props: SettingsAppProps): React.ReactNode {
  const dispatch = useAppDispatch();

  const theme =
    useAppSelector((state) => selectUserSetting(state, { key: "theme" })) ??
    "system";

  const performanceModeEnabled = useFlag("PERFORMANCE_MODE") === "enabled";

  const onChangeTheme = React.useCallback(
    (value: Theme) => {
      dispatch(setUserSetting({ key: "theme", value }));
    },
    [dispatch],
  );

  const onChangePerformanceMode = React.useCallback(
    (value: boolean) => {
      dispatch(
        setUserFlag({
          key: "PERFORMANCE_MODE",
          value: value ? "enabled" : "disabled",
        }),
      );
    },
    [dispatch],
  );

  return (
    <FieldSet title={text["settings.title"]} titleProps={titleProps} {...props}>
      <Field label={text["settings.theme"]}>
        <Picker<Theme> onValueChange={onChangeTheme} selectedValue={theme}>
          <PickerItem<Theme>
            label={text["settings.theme.system"]}
            value="system"
          />
          <PickerItem<Theme>
            label={text["settings.theme.light"]}
            value="light"
          />
          <PickerItem<Theme> label={text["settings.theme.dark"]} value="dark" />
        </Picker>
      </Field>
      <SwitchField
        label={text["settings.performance_mode"]}
        value={performanceModeEnabled}
        onValueChange={onChangePerformanceMode}
        FieldProps={{
          subLabel: text["settings.performance_mode.helper"],
        }}
      />
    </FieldSet>
  );
}
