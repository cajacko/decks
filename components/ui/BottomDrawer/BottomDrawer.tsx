import {
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  KeyboardAvoidingViewProps,
} from "react-native";
import Animated from "react-native-reanimated";
import {
  GestureDetector,
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import React from "react";
import { BottomDrawerProps, BottomDrawerRef } from "./BottomDrawer.types";
import styles from "./bottomDrawer.style";
import useBottomDrawer from "./useBottomDrawer";
import { useThemeColor } from "@/hooks/useThemeColor";
import ThemedText from "../ThemedText";

export const BottomDrawerWrapper = GestureHandlerRootView;

export default React.forwardRef<BottomDrawerRef, BottomDrawerProps>(
  function BottonDrawer({ children, style: styleProp, ...props }, ref) {
    const backgroundColor = useThemeColor("background");
    const state = useBottomDrawer(props, ref);

    const contentStyle = React.useMemo(
      () => [styles.content, { backgroundColor }],
      [backgroundColor],
    );

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
      [state.animatedStyles.bottomStyle],
    );

    const style = React.useMemo<KeyboardAvoidingViewProps["style"]>(
      () => StyleSheet.flatten([{ flex: 1, position: "relative" }, styleProp]),
      [styleProp],
    );

    return (
      <KeyboardAvoidingView
        style={style}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Animated.View style={drawerStyle}>
          <Animated.View style={drawerContainerStyle}>
            <View style={styles.drawerContainer}>
              <GestureDetector gesture={state.drag}>
                <View style={styles.dragBar}>
                  <Animated.View style={dragBoxStyle}>
                    <ThemedText style={styles.dragIcon}>====</ThemedText>
                  </Animated.View>
                  <Animated.View style={dragHeaderStyle} />
                </View>
              </GestureDetector>
              {/* NOTE: This fixes an issue with not being able to tap inputs inside the scroll view due to the gesture detector playing silly buggers
            https://chatgpt.com/g/g-p-67b5e925ea4881918dabd87d2acc4eb1-decks/c/67c75846-7134-8004-b0c9-014f2277aa83 */}
              <GestureHandlerRootView>
                <ScrollView
                  style={contentStyle}
                  keyboardShouldPersistTaps="handled"
                >
                  <View onLayout={state.onContentLayout}>{children}</View>
                </ScrollView>
              </GestureHandlerRootView>
            </View>
          </Animated.View>
        </Animated.View>
      </KeyboardAvoidingView>
    );
  },
);
