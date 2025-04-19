import React from "react";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";
import Number from "@/components/timer/Number";
import { StyleSheet, View } from "react-native";

export interface NumbersProps {
  initSeconds: number;
  /**
   * The number of seconds to display as an animated value
   */
  countdown: SharedValue<number>;
}

const height = 30;

const zeroToNine = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const Digit = React.memo(function Digit({
  countdown,
  reversedDigitIndex,
}: {
  countdown: SharedValue<number>;
  /**
   * Is this the last number, the 10's digits the 100's? Done as an index. So:
   * 0 = 1's
   * 1 = 10's
   * 2 = 100's
   * ...
   */
  reversedDigitIndex: number;
}) {
  /**
   * Returns the floored value of the countdown for this digit
   */
  const zeroToNineIndex = useDerivedValue((): number => {
    const countdownString = Math.ceil(countdown.value)
      .toString()
      .split(".")[0]
      .split("");

    const digit =
      countdownString[countdownString.length - 1 - reversedDigitIndex];

    return parseInt(digit, 10);
  });

  /**
   * Displays the correct digit for the countdown
   */
  const animatedStyle = useAnimatedStyle(() => {
    return {
      marginTop: -height * zeroToNineIndex.value,
    };
  });

  const style = React.useMemo(
    () => [styles.digit, animatedStyle],
    [animatedStyle],
  );

  return (
    <Animated.View style={style}>
      {zeroToNine.map((number, i) => (
        <View key={i} style={styles.numberContainer}>
          <Number number={number} />
        </View>
      ))}
    </Animated.View>
  );
});

export default React.memo(function Numbers({
  countdown,
  initSeconds,
}: NumbersProps): React.ReactNode {
  const countdownString = initSeconds.toString().split("");

  return (
    <View style={styles.container}>
      {countdownString.map((_, i) => {
        const reversedDigitIndex = countdownString.length - 1 - i;

        return (
          <Digit
            key={i}
            countdown={countdown}
            reversedDigitIndex={reversedDigitIndex}
          />
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    height,
    overflow: "hidden",
    flexDirection: "row",
  },
  digit: {
    flexDirection: "column",
    height: height * zeroToNine.length,
  },
  numberContainer: {
    height: height,
  },
});
