import { ScrollViewProps } from "react-native";

export interface StackListProps {
  handleLayout: Required<ScrollViewProps>["onLayout"];
}

export interface StackListRef {
  scrollNext?: () => Promise<void>;
  scrollPrev?: () => Promise<void>;
  scrollToStart: () => Promise<void>;
  scrollToEnd: () => Promise<void>;
  // scrollToStack: (stackId: string) => Promise<void>;
}
