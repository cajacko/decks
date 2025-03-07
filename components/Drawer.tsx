import React from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import ThemedView from "./ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { selectFlag } from "@/store/combinedSelectors/flags";
import { selectUserSetting, setUserSetting } from "@/store/slices/userSettings";
import DevMenu from "./Dev/DevMenu";
import Version from "./Version";
import Field from "./Field";
import Picker, { PickerItem } from "./Picker";
import { UserSettings } from "@/store/types";
import FieldSet from "./FieldSet";
import text from "@/constants/text";

type Theme = NonNullable<UserSettings.UserSettingValue<"theme">>;

const titleProps = { type: "h2" } as const;

export default function Drawer(): React.ReactNode {
  const dispatch = useAppDispatch();
  const devMode =
    useAppSelector((state) => selectFlag(state, { key: "DEV_MODE" })) === true;
  const theme =
    useAppSelector((state) => selectUserSetting(state, { key: "theme" })) ??
    "system";

  const onChangeTheme = React.useCallback(
    (value: Theme) => {
      dispatch(setUserSetting({ key: "theme", value }));
    },
    [dispatch],
  );

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.contentContainer}
    >
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            <View style={styles.settings}>
              <FieldSet title={text["settings.title"]} titleProps={titleProps}>
                <Field label={text["settings.theme"]}>
                  <Picker<Theme>
                    onValueChange={onChangeTheme}
                    selectedValue={theme}
                  >
                    <PickerItem<Theme>
                      label={text["settings.theme.system"]}
                      value="system"
                    />
                    <PickerItem<Theme>
                      label={text["settings.theme.light"]}
                      value="light"
                    />
                    <PickerItem<Theme>
                      label={text["settings.theme.dark"]}
                      value="dark"
                    />
                  </Picker>
                </Field>
                {devMode && <DevMenu />}
              </FieldSet>
            </View>
            <Version />
          </View>
        </SafeAreaView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  scroll: {
    flex: 1,
  },
  contentContainer: {
    minHeight: "100%",
  },
  settings: {
    flex: 1,
  },
});
