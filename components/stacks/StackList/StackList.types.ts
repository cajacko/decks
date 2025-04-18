import { StyleProp, ViewStyle } from "react-native";

export interface StackListProps {
  style?: StyleProp<ViewStyle>;
}

export type ScrollOptions = {
  animated?: boolean;
};

export interface StackListRef {
  getScrollOffset: () => number;
  scrollToOffset: (offset: number, options?: ScrollOptions) => Promise<void>;
  scrollNext?: (options?: ScrollOptions) => Promise<void>;
  scrollPrev?: (options?: ScrollOptions) => Promise<void>;
  scrollToStart: (options?: ScrollOptions) => Promise<void>;
  scrollToEnd: (options?: ScrollOptions) => Promise<void>;
  onDeleteStack: (stackId: string) => void;
}
