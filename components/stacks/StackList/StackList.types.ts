import { ScrollViewProps, StyleProp, ViewStyle } from "react-native";

export interface StackListProps {
  handleLayout?: Required<ScrollViewProps>["onLayout"];
  style?: StyleProp<ViewStyle>;
  skeleton?: boolean;
}

export type ScrollOptions = {
  animated?: boolean;
};

export interface StackListRef {
  scrollNext?: (options?: ScrollOptions) => Promise<void>;
  scrollPrev?: (options?: ScrollOptions) => Promise<void>;
  scrollToStart: (options?: ScrollOptions) => Promise<void>;
  scrollToEnd: (options?: ScrollOptions) => Promise<void>;
  onDeleteStack: (stackId: string) => void;
  // scrollToStack: (stackId: string) => Promise<void>;
}
