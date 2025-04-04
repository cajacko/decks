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
import { selectStackIds } from "@/store/selectors/tabletops";
import { useAppSelector } from "@/store/hooks";
import { StackListRef, ScrollOptions } from "./StackList.types";

const scrollPromise = () => new Promise((resolve) => setTimeout(resolve, 1000));

export function useInterval() {
  return useTabletopContext().stackWidth;
}

export default function useStackList(ref: React.ForwardedRef<StackListRef>) {
  const animatedRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(animatedRef);
  const { tabletopId, canOnlyFit1Stack } = useTabletopContext();
  const stackIds = useAppSelector((state) =>
    selectStackIds(state, { tabletopId }),
  );
  const [focussedStackId, setFocussedStackId] = React.useState<string | null>(
    null,
  );

  const [deletedStackIds, setDeletedStackIds] = React.useState<string[]>([]);

  const interval = useInterval();

  const updateFocusProps = React.useRef({
    interval,
    stackIds,
    canOnlyFit1Stack,
  });

  updateFocusProps.current = {
    interval,
    stackIds,
    canOnlyFit1Stack,
  };

  const updateFocus = React.useCallback((offset: number) => {
    if (!updateFocusProps.current.canOnlyFit1Stack) {
      setFocussedStackId(null);

      return;
    }

    const index = Math.round(offset / updateFocusProps.current.interval);
    const stackId = updateFocusProps.current.stackIds?.[index] ?? null;

    setFocussedStackId(stackId);
  }, []);

  useDerivedValue(() => {
    runOnJS(updateFocus)(scrollOffset.value);
  }, [scrollOffset]);

  const stackListRef = React.useRef<StackListRef>({
    getScrollOffset: () => scrollOffset.value,
    scrollToOffset: async (
      offset: number,
      { animated = true }: ScrollOptions = {},
    ) => {
      runOnUI(() => scrollTo(animatedRef, offset, 0, animated))();

      await scrollPromise();

      updateFocus(scrollOffset.value);
    },
    scrollNext: async ({ animated = true }: ScrollOptions = {}) => {
      const nextOffset = scrollOffset.value + interval;

      runOnUI(() => scrollTo(animatedRef, nextOffset, 0, animated))();

      await scrollPromise();

      updateFocus(scrollOffset.value);
    },
    scrollPrev: async ({ animated = true }: ScrollOptions = {}) => {
      const prevOffset = scrollOffset.value - interval;

      runOnUI(() => scrollTo(animatedRef, prevOffset, 0, animated))();

      await scrollPromise();

      updateFocus(scrollOffset.value);
    },
    scrollToStart: async ({ animated = true }: ScrollOptions = {}) => {
      runOnUI(() => scrollTo(animatedRef, 0, 0, animated))();

      await scrollPromise();

      updateFocus(scrollOffset.value);
    },
    scrollToEnd: async ({ animated = true }: ScrollOptions = {}) => {
      animatedRef.current?.scrollToEnd({ animated });

      await scrollPromise();

      updateFocus(scrollOffset.value);
    },
    onDeleteStack: async (stackId: string) => {
      setDeletedStackIds((prev) => [...prev, stackId]);

      await scrollPromise();

      updateFocus(scrollOffset.value);
    },
  });

  React.useImperativeHandle(ref, () => stackListRef.current);

  // This double checks and ensures the focus is correct. We have an issue where you delete the
  // first stack, and the focus is not updated correctly. It's probably because the scroll view if
  // auto scrolling (as it was the first item that was removed) and this doesn't triggered the
  // animated offset
  React.useEffect(() => {
    const interval = setInterval(() => {
      updateFocus(scrollOffset.value);
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, [scrollOffset, updateFocus]);

  const indicatorIds = React.useMemo(
    () =>
      stackIds &&
      stackIds.filter((stackId) => !deletedStackIds.includes(stackId)),
    [stackIds, deletedStackIds],
  );

  return {
    stackListRef,
    stackIds,
    animatedRef,
    focussedStackId,
    indicatorIds,
  };
}
