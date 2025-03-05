import React from "react";
import {
  StyleSheet,
  Pressable,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { nativeApplicationVersion, nativeBuildVersion } from "expo-application";
import ThemedText from "./ThemedText";
import ThemedView from "./ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import { expo } from "@/app.json";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { selectFlag } from "@/store/combinedSelectors/flags";
import { setUserFlag } from "@/store/slices/userSettings";
import Flags from "./Flags";
import Alert from "./Alert";
import text from "@/constants/text";

const version = nativeApplicationVersion
  ? `${nativeApplicationVersion} (${nativeBuildVersion})`
  : expo.version;

export default function Drawer(): React.ReactNode {
  const dispatch = useAppDispatch();
  const devMode =
    useAppSelector((state) => selectFlag(state, { key: "DEV_MODE" })) === true;

  // If we tap the version number 5 times, we enable dev mode

  const taps = React.useRef(0);
  const lastTap = React.useRef(0);

  const onVersionPress = React.useCallback(() => {
    const now = Date.now();

    if (now - lastTap.current < 3000) {
      taps.current += 1;
    }

    lastTap.current = now;

    if (taps.current >= 5) {
      if (devMode) {
        dispatch(setUserFlag({ key: "DEV_MODE", value: false }));
      } else {
        setShowDevModeAlert(true);
      }

      taps.current = 0;
    }
  }, [devMode, dispatch]);

  const [showDevModeAlert, setShowDevModeAlert] = React.useState(false);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.contentContainer}
    >
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            <View style={styles.main}>{devMode && <Flags />}</View>
            <Alert
              visible={showDevModeAlert}
              onRequestClose={() => setShowDevModeAlert(false)}
              title={text["settings.dev_mode.enable.title"]}
              message={text["settings.dev_mode.enable.description"]}
              buttons={[
                {
                  text: text["general.cancel"],
                  onPress: () => setShowDevModeAlert(false),
                  style: "cancel",
                },
                {
                  text: text["general.enable"],
                  onPress: () => {
                    setShowDevModeAlert(false);
                    dispatch(setUserFlag({ key: "DEV_MODE", value: !devMode }));
                  },
                  style: "default",
                },
              ]}
            />
            <Pressable style={styles.version} onPress={onVersionPress}>
              <ThemedText>
                v{version} - {Platform.OS}
              </ThemedText>
            </Pressable>
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
    padding: 10,
  },
  scroll: {
    flex: 1,
  },
  contentContainer: {
    minHeight: "100%",
  },
  main: {
    flex: 1,
  },
  version: {
    marginTop: 10,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
});
