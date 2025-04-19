import React from "react";
import ThemedText, { ThemedTextProps } from "@/components/ui/ThemedText";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { SharedValue, useDerivedValue } from "react-native-reanimated";
import Number from "@/components/timer/Number";

export interface NumbersProps {
  style?: StyleProp<ViewStyle>;
  time: SharedValue<number>;
  decimal: 1 | 10 | 100;
}

const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function Numbers({
  decimal,
  time,
  style: styleProp,
}: NumbersProps): React.ReactNode {
  const number = useDerivedValue<number>(() => {
    return Math.floor(time.value % decimal); // Last digit
  });

  const style = React.useMemo(() => [styles.container, styleProp], [styleProp]);

  return (
    <View style={style}>
      {numbers.map((text) => (
        <View key={text} style={styles.numberContainer}>
          <Number style={styles.number} number={text} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    height: 20,
  },
  numberContainer: {
    // marginVertical: 10,
  },
  number: {},
});
