import React from "react";
import FieldSet, { FieldSetProps } from "../forms/FieldSet";
import Button from "@/components/forms/Button";
import text from "@/constants/text";
import Field from "../forms/Field";
import useFlag from "@/hooks/useFlag";
import SwitchField from "../forms/SwitchField";
import { useAppDispatch } from "@/store/hooks";
import { setUserFlag } from "@/store/slices/userSettings";
import { dateToDateString } from "@/utils/dates";
import { useAuthentication } from "@/context/Authentication";
import { useSync } from "@/context/Sync";
import useRelativeTimeText from "@/hooks/useRelativeTimeText";
import ThemedText from "../ui/ThemedText";
import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

const titleProps = { type: "h2" } as const;

export type SettingsDeckProps = FieldSetProps;

export default function SettingsDeck(
  props: SettingsDeckProps,
): React.ReactNode {
  const devMode = useFlag("DEV_MODE") === true;
  const dispatch = useAppDispatch();
  const autoSync = useFlag("AUTO_SYNC") === "enabled";
  const auth = useAuthentication();
  const sync = useSync();
  const lastSynced = useRelativeTimeText(sync.lastSynced);
  const lastPulled = useRelativeTimeText(sync.lastPulled);
  const lastPushed = useRelativeTimeText(sync.lastPushed);

  const onChangeAutoSync = React.useCallback(
    (enableAutoSync: boolean) => {
      dispatch(
        setUserFlag({
          key: "AUTO_SYNC",
          value: enableAutoSync ? "enabled" : "disabled",
          date: dateToDateString(new Date()),
        }),
      );
    },
    [dispatch],
  );

  return (
    <FieldSet
      title={text["settings.backup_sync.title"]}
      titleProps={titleProps}
      initialCollapsed
      collapsible
      {...props}
    >
      {auth.isLoggedIn && (
        <View>
          {auth.user ? (
            <>
              <ThemedText>Logged in as {auth.user.name}</ThemedText>
              <Image
                source={{ uri: auth.user.picture }}
                style={{ width: 50, height: 50, borderRadius: 25 }}
              />
            </>
          ) : (
            <ThemedText>Logged In</ThemedText>
          )}
        </View>
      )}

      {auth.isLoggedIn && (
        <SwitchField
          value={autoSync}
          onValueChange={onChangeAutoSync}
          label="Auto Sync"
        />
      )}

      {auth.isLoggedIn && (
        <Field
          subLabel={`Last synced: ${sync.loading ? "Syncing..." : (lastSynced ?? "Never")}`}
          errorMessage={
            auth.error ? text["settings.backup_sync.error"] : undefined
          }
        >
          <Button title="Sync" onPress={() => sync.sync()} variant="outline" />
        </Field>
      )}

      {auth.isLoggedIn && devMode && (
        <Field
          subLabel={`Last pulled: ${lastPulled ?? "Never"}\nOverwrites what's on your device with what's in the cloud`}
        >
          <Button title="Pull" onPress={() => sync.pull()} variant="outline" />
        </Field>
      )}

      {auth.isLoggedIn && devMode && (
        <Field
          subLabel={`Last pushed: ${lastPushed ?? "Never"}\nOverwrites the saved data in the cloud with what's on your device now`}
        >
          <Button title="Push" onPress={() => sync.push()} variant="outline" />
        </Field>
      )}

      {auth.isLoggedIn && (
        <Field subLabel={text["settings.backup_sync.delete_cloud_data_helper"]}>
          <Button
            title="Delete Cloud Data"
            onPress={() => sync.remove()}
            variant="outline"
          />
        </Field>
      )}

      {auth.isLoggedIn ? (
        <Button
          title="Logout"
          onPress={() => auth.logout()}
          variant="outline"
        />
      ) : (
        <Field
          errorMessage={
            auth.error
              ? text["settings.authentication.generic_error"]
              : undefined
          }
        >
          <Button
            title="Sign In"
            onPress={() => auth.login()}
            variant="outline"
          />
        </Field>
      )}

      <View>
        <ThemedText type="h4" style={styles.aboutHeading}>
          About Backup & Sync
        </ThemedText>
        <ThemedText type="body2">
          {text["settings.backup_sync.helper"]}
        </ThemedText>
      </View>
    </FieldSet>
  );
}

const styles = StyleSheet.create({
  aboutHeading: {
    marginBottom: 10,
  },
});
