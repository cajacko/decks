import React from "react";
import { StyleSheet, View, Platform } from "react-native";
import ThemedView from "@/components/ui/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import DevMenu from "@/components/settings/Dev/DevMenu";
import Version from "@/components/settings/Version";
import SettingsApp from "@/components/settings/SettingsApp";
import SettingsBackupSync from "@/components/settings/SettingsBackupSync";
import FieldSet from "@/components/forms/FieldSet";
import { useTextLogo } from "@/hooks/useLogo";
import Image from "@/components/ui/Image";
import ThemedText from "@/components/ui/ThemedText";
import text from "@/constants/text";
import useApplyUpdateAlert from "@/hooks/useApplyUpdateAlert";
import Button from "@/components/forms/Button";
import AppStores from "@/components/ui/AppStores";
import { playfaceWebsite, dexWebLink } from "@/constants/links";
import useFlag from "@/hooks/useFlag";
import { TouchableOpacity } from "@/components/ui/Pressables";
import { ScrollView } from "react-native-gesture-handler";

export interface DrawerProps {
  closeDrawer: () => void;
  children: React.ReactNode;
}

export default function Drawer(props: DrawerProps): React.ReactNode {
  const { source } = useTextLogo();
  const updates = useApplyUpdateAlert();
  const devMode = useFlag("DEV_MODE") === true;
  const backupSyncEnabled = useFlag("BACKUP_SYNC") === "enabled";

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.contentContainer}
    >
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            <View style={styles.settings}>
              <FieldSet itemSpacing={30}>
                {props.children}
                <SettingsApp />
                {backupSyncEnabled && <SettingsBackupSync />}
                {devMode && <DevMenu closeDrawer={props.closeDrawer} />}
                {updates.canApplyUpdate && (
                  <View style={styles.mt}>
                    <ThemedText style={styles.updateText} type="h2">
                      {updates.title}
                    </ThemedText>
                    <ThemedText style={styles.updateText}>
                      {updates.message}
                    </ThemedText>
                    <Button
                      variant="outline"
                      title={updates.buttonText}
                      onPress={updates.reload}
                    />
                  </View>
                )}
              </FieldSet>
            </View>
            {Platform.OS === "web" && <AppStores style={styles.mt} />}
            {dexWebLink ? (
              <TouchableOpacity href={dexWebLink}>
                <Image
                  style={styles.logo}
                  source={source}
                  contentFit="contain"
                />
              </TouchableOpacity>
            ) : (
              <Image style={styles.logo} source={source} contentFit="contain" />
            )}
            <ThemedText style={styles.by}>{text["general.by"]}</ThemedText>
            <TouchableOpacity href={playfaceWebsite}>
              <Image
                style={styles.playface}
                source={require("../../assets/images/playface-circle-logo-text-right.png")}
                contentFit="contain"
              />
            </TouchableOpacity>
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
  mt: {
    marginTop: 20,
  },
  updateText: {
    marginBottom: 20,
  },
  playface: {
    height: 50,
    marginBottom: 10,
  },
  by: {
    marginBottom: 10,
    textAlign: "center",
  },
  logo: {
    marginTop: 20,
    height: 80,
    marginBottom: 10,
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
