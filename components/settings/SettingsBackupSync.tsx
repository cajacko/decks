import React from "react";
import FieldSet, {
  FieldSetProps,
  useLeftAdornmentSize,
} from "../forms/FieldSet";
import Button from "@/components/forms/Button";
import text from "@/constants/text";
import Field, { subLabelStyle } from "../forms/Field";
import useFlag from "@/hooks/useFlag";
import SwitchField from "../forms/SwitchField";
import { useAppDispatch } from "@/store/hooks";
import { setUserFlag } from "@/store/slices/userSettings";
import { dateToDateString } from "@/utils/dates";
import { useAuthentication } from "@/context/Authentication";
import { useSync } from "@/context/Sync";
import useRelativeTimeText from "@/hooks/useRelativeTimeText";
import ThemedText from "../ui/ThemedText";
import { StyleSheet, View } from "react-native";
import ProfilePic from "@/components/ui/ProfilePic";
import Collapsible from "../ui/Collapsible";
import { alert } from "../overlays/Alert";

const titleProps = { type: "h2" } as const;

export type SettingsBackupSyncProps = FieldSetProps;

export default function SettingsBackupSync(
  props: SettingsBackupSyncProps,
): React.ReactNode {
  const dispatch = useAppDispatch();
  const autoSync = useFlag("AUTO_SYNC") === "enabled";
  const auth = useAuthentication();
  const sync = useSync();
  const lastSynced = useRelativeTimeText(sync.lastSynced);
  const humanNumber = React.useMemo(
    () => Math.round(Math.random() * 10000),
    [],
  );

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

  const profilePicSize = useLeftAdornmentSize({ titleProps });

  return (
    <FieldSet
      title={text["settings.backup_sync.title"]}
      titleProps={titleProps}
      initialCollapsed
      collapsible
      leftAdornment={
        <ProfilePic size={profilePicSize} style={styles.profilePic} />
      }
      {...props}
    >
      {auth.isLoggedIn && (
        <SwitchField
          value={autoSync}
          onValueChange={onChangeAutoSync}
          label="Auto Sync"
        />
      )}

      {auth.isLoggedIn && (
        <Field
          subLabel={`Last synced: ${sync.loading ? "Syncing..." : (lastSynced ?? "Waiting to sync")}`}
          errorMessage={
            auth.error ? text["settings.backup_sync.error"] : undefined
          }
        >
          <Button title="Sync" onPress={() => sync.sync()} variant="outline" />
        </Field>
      )}

      {!auth.isLoggedIn && (
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

      {auth.isLoggedIn && (
        <Button
          title="Logout"
          onPress={() => auth.logout()}
          variant="outline"
        />
      )}

      {auth.isLoggedIn && (
        <Collapsible title="Danger Zone" initialCollapsed>
          <Field
            subLabel={text["settings.backup_sync.delete_cloud_data_helper"]}
            style={{ marginTop: 10 }}
          >
            <Button
              title="Delete Cloud Data"
              onPress={() =>
                alert(({ onRequestClose }) => ({
                  title: "Delete Cloud Data",
                  message:
                    "Are you sure you want to delete all your cloud data? This action cannot be undone.",
                  buttons: [
                    {
                      text: "Cancel",
                      onPress: onRequestClose,
                      style: "cancel",
                    },
                    {
                      text: "Delete",
                      onPress: () => {
                        sync.remove();
                      },
                      style: "destructive",
                    },
                  ],
                }))
              }
              variant="outline"
            />
          </Field>
        </Collapsible>
      )}

      <View>
        <ThemedText type="h4" style={styles.aboutHeading}>
          About Backup & Sync
        </ThemedText>
        <ThemedText type="body2">
          {text["settings.backup_sync.helper"]}
        </ThemedText>
      </View>

      {auth.isLoggedIn && (
        <View>
          <View style={styles.userInfo}>
            <View style={styles.userName}>
              <ThemedText type="body2" style={styles.userNameHeading}>
                Logged in as:
              </ThemedText>
              <ThemedText type="h4">
                {auth.user?.name ?? `Human #${humanNumber}`}
              </ThemedText>
            </View>
            <ProfilePic style={styles.profilePic} />
          </View>
        </View>
      )}
    </FieldSet>
  );
}

const styles = StyleSheet.create({
  aboutHeading: {
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: "row",
  },
  userNameHeading: {
    ...subLabelStyle,
  },
  userName: {
    flex: 1,
  },
  profilePic: {},
});
