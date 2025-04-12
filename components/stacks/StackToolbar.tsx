import React from "react";
import {
  StyleProp,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from "react-native";
import IconButton from "../forms/IconButton";
import ThemedText from "../ui/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import Color from "color";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useDrawer } from "@/context/Drawer";
import useFlag from "@/hooks/useFlag";
import { TouchableOpacity } from "@/components/ui/Pressables";
import { useAppSelector } from "@/store/hooks";
import { selectTabletopSettings } from "@/store/combinedSelectors/tabletops";

export interface StackToolbarProps {
  style?: StyleProp<ViewStyle>;
  handleShuffle?: () => void;
  handleFlipAll?: () => void;
  onPressTitle?: () => void;
  title: string;
  cardCount?: number;
  tabletopId: string;
}

const stackToolbarCardCount = 40;
const stackToolbarHeight = 40;

export const stackToolbarHeightAllowance =
  stackToolbarHeight + stackToolbarCardCount;

const iconSize = stackToolbarHeight - 10;
const moreLessDuration = 500;

const fadedOutOpacity = 0.4;

export default function StackToolbar(
  props: StackToolbarProps,
): React.ReactNode {
  const performanceMode: boolean = useFlag("PERFORMANCE_MODE") === "enabled";
  const backgroundColor = useThemeColor("background");
  const borderColor = useThemeColor("inputOutline");
  const closedWidth = useSharedValue<null | number>(null);
  const availableWidth = useSharedValue<null | number>(null);
  const { open: openDrawer } = useDrawer();
  const actionsWidthPercentage = useSharedValue(0);
  const hideCardCount = useAppSelector(
    (state) =>
      selectTabletopSettings(state, { tabletopId: props.tabletopId })
        ?.hideCardCount,
  );

  const onToolbarInnerLayout = React.useCallback<
    NonNullable<ViewProps["onLayout"]>
  >(
    (event) => {
      if (closedWidth.value !== null) return;

      const { width } = event.nativeEvent.layout;

      closedWidth.value = width;
    },
    [closedWidth],
  );

  const onContainerLayout = React.useCallback<
    NonNullable<ViewProps["onLayout"]>
  >(
    (event) => {
      const { width } = event.nativeEvent.layout;

      availableWidth.value = width;
    },
    [availableWidth],
  );

  const style = React.useMemo(
    () => StyleSheet.flatten([styles.container, props.style]),
    [props.style],
  );

  const labelContainerStyle = React.useMemo(
    () =>
      StyleSheet.flatten([
        styles.labelContainer,
        { backgroundColor: backgroundColor },
      ]),
    [backgroundColor],
  );

  const moreLessContainerStyle = React.useMemo(
    () =>
      StyleSheet.flatten([
        styles.moreLessContainer,
        { backgroundColor: backgroundColor },
      ]),
    [backgroundColor],
  );

  const animatedOpacityStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        actionsWidthPercentage.value,
        [0, 100],
        [fadedOutOpacity, 1],
      ),
    };
  });

  const toolbarStyle = React.useMemo(
    () => [
      StyleSheet.flatten([
        styles.toolbar,
        {
          backgroundColor: Color(backgroundColor).alpha(0.5).toString(),
          borderColor,
        },
      ]),
      animatedOpacityStyle,
    ],
    [backgroundColor, borderColor, animatedOpacityStyle],
  );

  const [lessMore, setLessMore] = React.useState<"unfold-more" | "unfold-less">(
    "unfold-more",
  );

  const animatedActionsStyle = useAnimatedStyle(() => {
    if (closedWidth.value === null || availableWidth.value === null) {
      return {
        width: 0,
      };
    }

    return {
      width: interpolate(
        actionsWidthPercentage.value,
        [0, 100],
        [0, availableWidth.value - closedWidth.value],
      ),
    };
  });

  const actionsStyle = React.useMemo(
    () => [styles.actions, animatedActionsStyle],
    [animatedActionsStyle],
  );

  const onPressLessMore = React.useCallback(() => {
    setLessMore((prevState) => {
      if (prevState === "unfold-more") {
        if (performanceMode) {
          actionsWidthPercentage.value = 100;
        } else {
          actionsWidthPercentage.value = withTiming(100, {
            duration: moreLessDuration,
          });
        }

        return "unfold-less";
      }

      if (performanceMode) {
        actionsWidthPercentage.value = 0;
      } else {
        actionsWidthPercentage.value = withTiming(0, {
          duration: moreLessDuration,
        });
      }

      return "unfold-more";
    });
  }, [actionsWidthPercentage, performanceMode]);

  const onPressTitle = props.onPressTitle ?? onPressLessMore;

  return (
    <View style={style} onLayout={onContainerLayout}>
      <Animated.View style={toolbarStyle}>
        <View style={styles.toolbarInner} onLayout={onToolbarInnerLayout}>
          <TouchableOpacity
            style={labelContainerStyle}
            contentContainerStyle={styles.labelContentContainer}
            vibrate
            onPress={onPressTitle}
          >
            <ThemedText type="body2">{props.title}</ThemedText>
          </TouchableOpacity>
          <Animated.View style={actionsStyle}>
            <IconButton
              onPress={props.handleShuffle}
              disabled={!props.handleShuffle}
              icon="shuffle"
              size={iconSize}
              variant="transparent"
              vibrate
            />
            <IconButton
              icon="flip"
              size={iconSize}
              variant="transparent"
              vibrate
              onPress={props.handleFlipAll}
              disabled={!props.handleFlipAll}
            />
            <IconButton
              icon="more-horiz"
              size={iconSize}
              variant="transparent"
              vibrate
              onPress={openDrawer}
            />
          </Animated.View>
          <View style={moreLessContainerStyle}>
            <IconButton
              icon={lessMore}
              size={iconSize}
              variant="transparent"
              style={styles.moreLess}
              onPress={onPressLessMore}
              iconRotation={90}
              vibrate
              contentContainerStyle={styles.moreLessContentContainer}
            />
          </View>
        </View>
      </Animated.View>
      {!!props.cardCount && !hideCardCount && (
        <Animated.View
          style={[styles.cardCountContainer, animatedOpacityStyle]}
        >
          <View style={styles.cardCountContent}>
            <ThemedText type="body2">{props.cardCount}</ThemedText>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    position: "relative",
  },
  cardCountContainer: {
    position: "relative",
    width: "100%",
  },
  cardCountContent: {
    height: stackToolbarCardCount,
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  toolbar: {
    height: stackToolbarHeight,
    borderRadius: stackToolbarHeight / 2,
    borderWidth: 1,
    overflow: "hidden",
  },
  toolbarInner: {
    flex: 1,
    flexDirection: "row",
  },
  labelContainer: {
    height: stackToolbarHeight,
  },
  labelContentContainer: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    paddingLeft: 20,
    paddingRight: 10,
  },
  moreLessContainer: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  moreLess: {
    height: stackToolbarHeight,
  },
  moreLessContentContainer: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    overflow: "hidden",
  },
});
