import React from "react";
import CardInstance from "@/components/cards/connected/CardInstance";
import { StackTopCardProps } from "./types";
import HoldMenu from "../HoldMenu";
import useMenuItems from "./useMenuItems";
import EditCardModal from "../EditCardModal";
import { Target } from "@/utils/cardTarget";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import CardContainer from "../cards/connected/CardContainer";
import Animated from "react-native-reanimated";
import { useThemeColor } from "@/hooks/useThemeColor";

export * from "./types";

export default function StackTopCard({
  style: styleProp,
  ...props
}: StackTopCardProps): React.ReactNode {
  const state = useMenuItems(props);
  const backgroundColor = useThemeColor("background");

  const target = React.useMemo(
    (): Target => ({ id: state.cardId, type: "card" }),
    [state.cardId],
  );

  const style = React.useMemo((): StyleProp<ViewStyle> => {
    if (state.animatedToBack) return [styleProp, { zIndex: 0 }];

    return styleProp;
  }, [styleProp, state.animatedToBack]);

  return (
    <>
      <HoldMenu
        menuItems={state.menuItems}
        handleLongPress={state.handlePress}
        handleDoubleTap={state.handlePress}
        style={style}
        hideActions={state.hideActions}
      >
        {({ longPressStyle }) => (
          <CardInstance
            {...props}
            ref={state.cardInstanceRef}
            onAnimationChange={state.setIsAnimating}
          >
            <Animated.View style={[styles.longPressContainer, longPressStyle]}>
              <CardContainer
                target={target}
                backgroundColor={backgroundColor}
              />
            </Animated.View>
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
}

const styles = StyleSheet.create({
  longPressContainer: {
    height: "100%",
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
});
