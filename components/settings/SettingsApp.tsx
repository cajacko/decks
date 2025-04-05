import React from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  selectUserSetting,
  setUserFlag,
  setUserSetting,
} from "@/store/slices/userSettings";
import Field from "../forms/Field";
import Picker from "../forms/Picker";
import { UserSettings } from "@/store/types";
import FieldSet, { useLeftAdornmentSize } from "../forms/FieldSet";
import text from "@/constants/text";
import SwitchField from "../forms/SwitchField";
import useFlag from "@/hooks/useFlag";
import { defaultTheme } from "@/hooks/useColorScheme";
import { Platform } from "react-native";
import { dateToDateString } from "@/utils/dates";
import IconSymbol from "../ui/IconSymbol";

type Theme = NonNullable<UserSettings.UserSettingValue<"theme">>;

const titleProps = { type: "h2" } as const;

export default function SettingsApp(): React.ReactNode {
  const dispatch = useAppDispatch();

  const theme =
    useAppSelector((state) => selectUserSetting(state, { key: "theme" })) ??
    defaultTheme;

  const performanceModeEnabled = useFlag("PERFORMANCE_MODE") === "enabled";
  const holdMenuAlwaysVisible =
    useFlag("HOLD_MENU_BEHAVIOUR") === "always-visible";

  const vibrate = useFlag("CARD_ACTIONS_HAPTICS") === "enabled";
  const shakeToShuffle = useFlag("SHAKE_TO_SHUFFLE") === "enabled";
  const editCardMoreInfo = useFlag("EDIT_CARD_MORE_INFO") === "enabled";
  const iconSize = useLeftAdornmentSize({ titleProps });

  const onChangeTheme = React.useCallback(
    (value: Theme) => {
      dispatch(
        setUserSetting({
          key: "theme",
          value,
          date: dateToDateString(new Date()),
        }),
      );
    },
    [dispatch],
  );

  const onChangePerformanceMode = React.useCallback(
    (value: boolean) => {
      dispatch(
        setUserFlag({
          key: "PERFORMANCE_MODE",
          value: value ? "enabled" : "disabled",
          date: dateToDateString(new Date()),
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
          date: dateToDateString(new Date()),
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
          date: dateToDateString(new Date()),
        }),
      );
    },
    [dispatch],
  );

  const onChangeShakeToShuffle = React.useCallback(
    (value: boolean) => {
      dispatch(
        setUserFlag({
          key: "SHAKE_TO_SHUFFLE",
          value: value ? "enabled" : "disabled",
          date: dateToDateString(new Date()),
        }),
      );
    },
    [dispatch],
  );

  const onChangeEditCardMoreInfo = React.useCallback(
    (value: boolean) => {
      dispatch(
        setUserFlag({
          key: "EDIT_CARD_MORE_INFO",
          value: value ? "enabled" : "disabled",
          date: dateToDateString(new Date()),
        }),
      );
    },
    [dispatch],
  );

  return (
    <FieldSet
      title={text["settings.title"]}
      titleProps={titleProps}
      initialCollapsed
      collapsible
      leftAdornment={<IconSymbol name="settings" size={iconSize} />}
    >
      <Field label={text["settings.theme"]}>
        <Picker<Theme>
          onValueChange={onChangeTheme}
          selectedValue={theme}
          items={[
            {
              label: text["settings.theme.system"],
              value: "system",
              key: "system",
            },
            {
              label: text["settings.theme.light"],
              value: "light",
              key: "light",
            },
            { label: text["settings.theme.dark"], value: "dark", key: "dark" },
          ]}
        />
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
        label={text["settings.edit_card.more_info"]}
        FieldProps={{
          subLabel: text["settings.edit_card.more_info.helper"],
        }}
        value={editCardMoreInfo}
        onValueChange={onChangeEditCardMoreInfo}
      />
      {Platform.OS !== "web" && (
        <SwitchField
          label={text["settings.shake_shuffle"]}
          value={shakeToShuffle}
          onValueChange={onChangeShakeToShuffle}
        />
      )}
      {Platform.OS !== "web" && (
        <SwitchField
          label={text["settings.card_actions_haptics"]}
          value={vibrate}
          onValueChange={onChangeVibrate}
          FieldProps={{
            subLabel: text["settings.card_actions_haptics.helper"],
          }}
        />
      )}
    </FieldSet>
  );
}
