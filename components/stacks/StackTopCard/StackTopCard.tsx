import React from "react";
import CardInstance from "@/components/cards/connected/CardInstance";
import { StackTopCardProps } from "./types";
import HoldMenu from "@/components/ui/HoldMenu";
import useMenuItems from "./useMenuItems";
import EditCardModal from "@/components/editCard/EditCardModal";
import { Target } from "@/utils/cardTarget";
import { StyleProp, ViewStyle, StyleSheet } from "react-native";
import { usePerformanceMonitor } from "@/context/PerformanceMonitor";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";
import CardContainer from "@/components/cards/connected/CardContainer";
import { useThemeColor } from "@/hooks/useThemeColor";
import Color from "color";

export * from "./types";

const LongPressOverlay = React.memo(function LongPressOverlay({
  target,
  longPressSharedValue,
}: {
  target: Target;
  longPressSharedValue: SharedValue<number>;
}) {
  const _backgroundColor = useThemeColor("background");
  const backgroundColor = React.useMemo(
    () => Color(_backgroundColor).alpha(0.5).rgb().string(),
    [_backgroundColor],
  );

  const longPress = useDerivedValue(() =>
    interpolate(longPressSharedValue.value, [0, 0.5, 1], [0, 0, 1]),
  );

  const longPressStyle = useAnimatedStyle(() => ({
    opacity: longPress.value,
    transform: [{ scale: longPress.value }],
  }));

  const style = React.useMemo(
    () => [styles.longPressContainer, longPressStyle],
    [longPressStyle],
  );

  const cardContainerStyle = React.useMemo(
    () => ({ backgroundColor }),
    [backgroundColor],
  );

  return (
    <Animated.View style={style}>
      <CardContainer target={target} style={cardContainerStyle} />
    </Animated.View>
  );
});

export default React.memo(function StackTopCard({
  style: styleProp,
  hideActions = false,
  ...props
}: StackTopCardProps): React.ReactNode {
  const state = useMenuItems(props);

  const target = React.useMemo(
    (): Target => ({ id: state.cardId, type: "card" }),
    [state.cardId],
  );

  const style = React.useMemo((): StyleProp<ViewStyle> => {
    if (state.animatedToBack) return [styleProp, { zIndex: 0 }];

    return styleProp;
  }, [styleProp, state.animatedToBack]);

  usePerformanceMonitor({
    Component: StackTopCard.name,
  });

  return (
    <>
      <HoldMenu
        menuItems={state.menuItems}
        style={style}
        hideActions={hideActions || state.hideMenuItems}
        handleTap={state.handleTap}
        handleLongPress={state.handleLongPress}
        longPressDuration={2000}
      >
        {({ longPressSharedValue }) => (
          <CardInstance
            {...props}
            ref={state.cardInstanceRef}
            onAnimationChange={state.setIsAnimating}
          >
            <LongPressOverlay
              target={target}
              longPressSharedValue={longPressSharedValue}
            />
          </CardInstance>
        )}
      </HoldMenu>
      <EditCardModal
        visible={state.showEditModal}
        onRequestClose={state.closeEditModal}
        target={target}
        initialSide={state.side}
        onDelete={state.closeEditModal}
      />
    </>
  );
});

const styles = StyleSheet.create({
  longPressContainer: {
    zIndex: 999,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
  },
});
