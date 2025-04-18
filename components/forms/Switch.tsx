import React from "react";
import {
  Switch as RNSwitch,
  SwitchProps as RNSwitchProps,
  StyleSheet,
  View,
} from "react-native";
import text from "@/constants/text";
import ThemedText from "../ui/ThemedText";
import { useThemeColors } from "@/hooks/useThemeColor";

export interface SwitchProps extends RNSwitchProps {
  label?: string;
}

export default function Switch({
  label: labelProp,
  ...props
}: SwitchProps): React.ReactNode {
  const colors = useThemeColors();
  let label = props.value ? text["general.on"] : text["general.off"];

  if (labelProp) {
    label = labelProp;
  }

  return (
    <View style={styles.container}>
      <ThemedText style={styles.text}>{label}</ThemedText>
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
