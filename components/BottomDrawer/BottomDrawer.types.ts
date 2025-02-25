import React from "react";
import { SharedValue } from "react-native-reanimated";

export const defaultProps = {
  maxHeight: 1000,
  minHeight: 100,
};

export interface BottomDrawerProps {
  children?: React.ReactNode;
  height: SharedValue<number>;
  maxHeight?: number;
  minHeight?: number;
}

export interface BottomDrawerRef {
  open: () => void;
  close: () => void;
}
