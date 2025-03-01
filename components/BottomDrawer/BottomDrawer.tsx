import { View, Text, ScrollView } from "react-native";
import Animated from "react-native-reanimated";
import {
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import React from "react";
import { BottomDrawerProps, BottomDrawerRef } from "./BottomDrawer.types";
import styles from "./bottomDrawer.style";
import useBottomDrawer from "./useBottomDrawer";

export const BottomDrawerWrapper = GestureHandlerRootView;

export default React.forwardRef<BottomDrawerRef, BottomDrawerProps>(
  function BottonDrawer({ children, ...props }, ref) {
    const state = useBottomDrawer(props, ref);

    const drawerContainerStyle = React.useMemo(
      () => [styles.drawerContainer, state.animatedStyles.height],
      [state.animatedStyles.height],
    );

    // NOTE: StyleSheet.flatten would remove the dragBarColor for some reason? And AnimatedView
    // thing from reanamiated perhaps?
    const dragBoxStyle = React.useMemo(
      () => [styles.dragBox, state.animatedStyles.dragBarColor],
      [state.animatedStyles.dragBarColor],
    );

    const dragHeaderStyle = React.useMemo(
      () => [styles.dragHeader, state.animatedStyles.dragBarColor],
      [state.animatedStyles.dragBarColor],
    );

    const drawerStyle = React.useMemo(
      () => [styles.drawer, state.animatedStyles.bottomStyle],
      [],
    );

    return (
      <Animated.View style={drawerStyle}>
        <Animated.View style={drawerContainerStyle}>
          <View style={styles.drawerContainer}>
            <GestureDetector gesture={state.drag}>
              <View style={styles.dragBar}>
                <Animated.View style={dragBoxStyle}>
                  <Text style={styles.dragIcon}>====</Text>
                </Animated.View>
                <Animated.View style={dragHeaderStyle} />
              </View>
            </GestureDetector>
            <ScrollView style={styles.content}>
              <View onLayout={state.onContentLayout}>{children}</View>
            </ScrollView>
          </View>
        </Animated.View>
      </Animated.View>
    );
  },
);
