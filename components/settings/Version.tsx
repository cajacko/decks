import React from "react";
import { StyleSheet, Pressable, Platform, ViewStyle, View } from "react-native";
import { nativeApplicationVersion, nativeBuildVersion } from "expo-application";
import ThemedText from "@/components/ui/ThemedText";
import app from "@/constants/app";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { selectFlag } from "@/store/combinedSelectors/flags";
import { setUserFlag } from "@/store/slices/userSettings";
import Alert from "@/components/overlays/Alert";
import text from "@/constants/text";
import { commitSha } from "@/constants/commitSha.json";
import { useUpdates } from "expo-updates";
import { useThemeColors } from "@/hooks/useThemeColor";

let version = nativeApplicationVersion
  ? `${nativeApplicationVersion} (${nativeBuildVersion})`
  : app.version;

if (commitSha) {
  version += ` - ${commitSha}`;
}

export default function Version(props: { style?: ViewStyle }): React.ReactNode {
  const dispatch = useAppDispatch();
  const colors = useThemeColors();
  const {
    isChecking,
    isDownloading,
    isUpdateAvailable,
    isUpdatePending,
    checkError,
    downloadError,
    initializationError,
  } = useUpdates();

  let updateIndicatorColor: string | null;

  if (isChecking || isDownloading) {
    updateIndicatorColor = colors.warning;
  } else if (checkError || downloadError || initializationError) {
    updateIndicatorColor = colors.error;
  } else if (isUpdateAvailable || isUpdatePending) {
    updateIndicatorColor = colors.success;
  } else {
    updateIndicatorColor = null;
  }

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

  const style = React.useMemo(
    () => StyleSheet.flatten([styles.version, props.style]),
    [props.style],
  );

  return (
    <>
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
      <Pressable style={style} onPress={onVersionPress}>
        <View>
          <ThemedText>
            v{version} - {Platform.OS}
          </ThemedText>
          {updateIndicatorColor && (
            <View style={styles.indicatorContainer}>
              <View
                style={[
                  styles.indicator,
                  { backgroundColor: updateIndicatorColor },
                ]}
              />
            </View>
          )}
        </View>
      </Pressable>
    </>
  );
}

const indicatorSize = 8;

const styles = StyleSheet.create({
  version: {
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    position: "relative",
    justifyContent: "center",
  },
  indicatorContainer: {
    position: "absolute",
    right: -indicatorSize * (3 / 2),
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    width: indicatorSize,
    height: "100%",
    opacity: 0.25,
  },
  indicator: {
    height: indicatorSize,
    width: indicatorSize,
    borderRadius: indicatorSize / 2,
  },
});
