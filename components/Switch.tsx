import React from "react";
import {
  Switch as RNSwitch,
  SwitchProps as RNSwitchProps,
  StyleSheet,
  View,
} from "react-native";
import text from "@/constants/text";
import ThemedText from "./ThemedText";
import { useThemeColors } from "@/hooks/useThemeColor";

export type SwitchProps = RNSwitchProps;

export default function Switch(props: SwitchProps): React.ReactNode {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <ThemedText style={styles.text}>
        {props.value ? text["general.on"] : text["general.off"]}
      </ThemedText>
      <RNSwitch
        trackColor={{
          true: colors.switchTrackTrue,
          false: colors.switchTrackFalse,
        }}
        thumbColor={colors.switchThumb}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  text: {
    marginRight: 8,
  },
});
