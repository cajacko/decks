import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { GestureType } from "react-native-gesture-handler";
import { AnimatedStyle, SharedValue } from "react-native-reanimated";

export interface MenuItemComponentProps {
  isHighlighted?: boolean;
}
export interface MenuItem {
  height: number;
  width: number;
  handleAction: () => void;
  component:
    | React.ReactNode
    | ((props: MenuItemComponentProps) => React.ReactNode);
}

export interface MenuItemProps extends MenuItem {
  position: MenuPosition;
  style?: AnimatedStyle<ViewStyle>;
  contentStyle?: AnimatedStyle<ViewStyle>;
  isHighlighted?: boolean;
  tapGesture: GestureType;
}

export type MenuPosition = "top" | "bottom" | "left" | "right";

export type MenuItems = {
  [K in MenuPosition]?: MenuItem;
};

export type RenderChildren = (props: {
  longPressSharedValue: SharedValue<number>;
  longPressStyle: AnimatedStyle<ViewStyle>;
}) => React.ReactNode;

export interface HoldMenuProps {
  handleLongPress?: () => void;
  scaleOnTouch?: boolean;
  toggleMenuOnTap?: boolean;
  handleTap?: () => void;
  /**
   * Removing double tap as it blocks other interactions as we have to wait to see if this happens
   */
  // handleDoubleTap?: () => void;
  menuItems: MenuItems | null;
  touchBuffer?: number;
  children?: React.ReactNode | RenderChildren;
  style?: StyleProp<ViewStyle>;
  hideActions?: boolean;
}
