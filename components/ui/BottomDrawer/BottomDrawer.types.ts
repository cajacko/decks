import React from "react";
import { KeyboardAvoidingViewProps } from "react-native";
import { SharedValue } from "react-native-reanimated";

export const defaultProps = {
  maxHeight: 1000,
  minHeight: 100,
};

export interface BottomDrawerProps {
  children?: React.ReactNode;
  height: SharedValue<number>;
  initHeight: number;
  maxHeight?: number | null;
  minHeight?: number;
  openOnMount?: boolean;
  animateIn?: boolean;
  style?: KeyboardAvoidingViewProps["style"];
}

export interface BottomDrawerRef {
  open: () => Promise<void>;
  close: () => Promise<void>;
}
