import React from "react";
import { ViewStyle } from "react-native";
import { AnimatedStyle } from "react-native-reanimated";

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
}

export type MenuPosition = "top" | "bottom" | "left" | "right";

export type MenuItems = {
  [K in MenuPosition]?: MenuItem;
};

export interface HoldMenuProps {
  handlePress?: () => void;
  menuItems: MenuItems;
  touchBuffer?: number;
  children?: React.ReactNode;
  style?: ViewStyle;
  hideActions?: boolean;
}
