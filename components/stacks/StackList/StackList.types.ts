import { ScrollViewProps } from "react-native";
import { StyleProps } from "react-native-reanimated";

export interface StackListProps {
  handleLayout?: Required<ScrollViewProps>["onLayout"];
  style?: StyleProps;
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
  // scrollToStack: (stackId: string) => Promise<void>;
}
