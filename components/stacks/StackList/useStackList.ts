import React from "react";
import Animated, {
  scrollTo,
  useAnimatedRef,
  useScrollViewOffset,
  runOnUI,
  useDerivedValue,
  runOnJS,
} from "react-native-reanimated";
import { useTabletopContext } from "@/components/tabletops/Tabletop/Tabletop.context";
import { selectStackIds } from "@/store/slices/tabletop";
import { useAppSelector } from "@/store/hooks";
import { StackListRef, ScrollOptions } from "./StackList.types";

const scrollPromise = () => new Promise((resolve) => setTimeout(resolve, 1000));

export default function useStackList() {
  const animatedRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(animatedRef);
  const { stackWidth, tabletopId, canOnlyFit1Stack } = useTabletopContext();
  const stackIds = useAppSelector((state) =>
    selectStackIds(state, { tabletopId }),
  );
  const [focussedStackId, setFocussedStackId] = React.useState<string | null>(
    null,
  );

  const interval = stackWidth;

  const updateFocus = React.useCallback(
    (offset: number) => {
      if (!canOnlyFit1Stack) {
        setFocussedStackId(null);

        return;
      }

      const index = Math.round(offset / interval);
      const stackId = stackIds?.[index] ?? null;

      setFocussedStackId(stackId);
    },
    [interval, stackIds, canOnlyFit1Stack],
  );

  useDerivedValue(() => {
    runOnJS(updateFocus)(scrollOffset.value);
  }, [scrollOffset]);

  const stackListRef = React.useRef<StackListRef>({
    scrollNext: async ({ animated = true }: ScrollOptions = {}) => {
      const nextOffset = scrollOffset.value + interval;

      runOnUI(() => scrollTo(animatedRef, nextOffset, 0, animated))();

      await scrollPromise();
    },
    scrollPrev: async ({ animated = true }: ScrollOptions = {}) => {
      const prevOffset = scrollOffset.value - interval;

      runOnUI(() => scrollTo(animatedRef, prevOffset, 0, animated))();

      await scrollPromise();
    },
    scrollToStart: async ({ animated = true }: ScrollOptions = {}) => {
      runOnUI(() => scrollTo(animatedRef, 0, 0, animated))();

      await scrollPromise();
    },
    scrollToEnd: async ({ animated = true }: ScrollOptions = {}) => {
      animatedRef.current?.scrollToEnd({ animated });

      await scrollPromise();
    },
  });

  return {
    stackListRef,
    stackIds,
    interval,
    animatedRef,
    focussedStackId,
  };
}
