import React from "react";
import { SharedValue } from "react-native-reanimated";

export const defaultProps = {
  maxHeight: 1000,
  minHeight: 100,
};

export interface BottomDrawerProps {
  children?: React.ReactNode;
  height: SharedValue<number>;
  maxHeight?: number | null;
  minHeight?: number;
  openOnMount?: boolean;
}

export interface BottomDrawerRef {
  open: () => void;
  close: () => void;
}
