import React from "react";
import ThemedText from "@/components/ui/ThemedText";
import { StyleSheet, View } from "react-native";
import Numbers, { commonTextProps } from "@/components/timer/Numbers";
import { useDerivedValue, useSharedValue } from "react-native-reanimated";

export interface CountdownProps {
  children?: React.ReactNode;
}

/**
 * Digits are named A, B, C etc. With A being the last displayed digit, B the second last etc. As we
 * always start from the last displayed digit as we have to show that.
 *
 * Each digit is a value between 0 and 9.9999.... And indicates how the Numbers component should
 * position itself. Which is a vertical list of digits. The digits can be in-between absolute values
 */
export default function Countdown(props: CountdownProps): React.ReactNode {
  const time = useSharedValue(60);

  return (
    <View style={styles.container}>
      <Numbers style={styles.numbers} time={time} decimal={10} />
      <Numbers style={styles.numbers} time={time} decimal={1} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  numbers: {
    marginHorizontal: 2,
  },
});
