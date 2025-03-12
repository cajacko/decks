import React from "react";
import {
  Switch as RNSwitch,
  SwitchProps as RNSwitchProps,
  StyleSheet,
  View,
} from "react-native";
import text from "@/constants/text";
import ThemedText from "./ThemedText";

export type SwitchProps = RNSwitchProps;

export default function Switch(props: SwitchProps): React.ReactNode {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.text}>
        {props.value ? text["general.on"] : text["general.off"]}
      </ThemedText>
      <RNSwitch {...props} />
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
