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
import { defaultTheme } from "@/hooks/useColorScheme";

type Theme = NonNullable<UserSettings.UserSettingValue<"theme">>;

const titleProps = { type: "h2" } as const;

export interface SettingsAppProps extends FieldSetProps {
  closeDrawer: () => void;
}

export default function SettingsApp(props: SettingsAppProps): React.ReactNode {
  const dispatch = useAppDispatch();

  const theme =
    useAppSelector((state) => selectUserSetting(state, { key: "theme" })) ??
    defaultTheme;

  const performanceModeEnabled = useFlag("PERFORMANCE_MODE") === "enabled";
  const holdMenuAlwaysVisible =
    useFlag("HOLD_MENU_BEHAVIOUR") === "always-visible";

  const vibrate = useFlag("CARD_ACTIONS_HAPTICS") === "enabled";

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

  const onChangeHoldMenu = React.useCallback(
    (value: boolean) => {
      dispatch(
        setUserFlag({
          key: "HOLD_MENU_BEHAVIOUR",
          value: value ? "always-visible" : "hold/hover",
        }),
      );
    },
    [dispatch],
  );

  const onChangeVibrate = React.useCallback(
    (value: boolean) => {
      dispatch(
        setUserFlag({
          key: "CARD_ACTIONS_HAPTICS",
          value: value ? "enabled" : "disabled",
        }),
      );
    },
    [dispatch],
  );

  return (
    <FieldSet title={text["settings.title"]} titleProps={titleProps} {...props}>
      <Field label={text["settings.theme"]}>
        <Picker<Theme>
          onValueChange={onChangeTheme}
          selectedValue={theme}
          iosButtonTitle={text[`settings.theme.${theme}`]}
        >
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
      <SwitchField
        label={text["settings.hold_menu.always_show"]}
        value={holdMenuAlwaysVisible}
        onValueChange={onChangeHoldMenu}
      />
      <SwitchField
        label={text["settings.card_actions_haptics"]}
        value={vibrate}
        onValueChange={onChangeVibrate}
        FieldProps={{
          subLabel: text["settings.card_actions_haptics.helper"],
        }}
      />
    </FieldSet>
  );
}
