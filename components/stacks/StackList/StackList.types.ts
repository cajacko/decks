import { ScrollViewProps } from "react-native";
import { StyleProps } from "react-native-reanimated";

export interface StackListProps {
  handleLayout?: Required<ScrollViewProps>["onLayout"];
  style?: StyleProps;
  skeleton?: boolean;
}

export interface StackListRef {
  scrollNext?: () => Promise<void>;
  scrollPrev?: () => Promise<void>;
  scrollToStart: () => Promise<void>;
  scrollToEnd: () => Promise<void>;
  // scrollToStack: (stackId: string) => Promise<void>;
}
