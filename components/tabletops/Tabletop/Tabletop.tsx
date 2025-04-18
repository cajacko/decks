import React from "react";
import { StyleSheet } from "react-native";
import { TabletopProps } from "@/components/tabletops/Tabletop/Tabletop.types";
import StackList, {
  StackListRef,
  StackListSkeleton,
} from "@/components/stacks/StackList";
import useEnsureTabletop from "@/hooks/useEnsureTabletop";
import {
  useAppSelector,
  useAppDispatch,
  useRequiredAppSelector,
} from "@/store/hooks";
import { selectTabletopNeedsResetting } from "@/store/combinedSelectors/tabletops";
import { resetTabletopHelper } from "@/store/actionHelpers/tabletop";
import { TabletopProvider } from "./Tabletop.context";
import { Target } from "@/utils/cardTarget";
import {
  StackProvider,
  StackProviderProps,
} from "@/components/stacks/Stack/Stack.context";
import { defaultCardSizePreset } from "@/components/cards/connected/CardSpacerSkeleton";
import { selectDeck } from "@/store/selectors/decks";
import { usePerformanceMonitor } from "@/context/PerformanceMonitor";
import { useRequiredContainerSize } from "@/context/ContainerSize";
import { useSetStackListRef } from "@/context/StackListRefs";

function TabletopContent(
  props: Omit<
    StackProviderProps,
    "availableHeight" | "availableWidth" | "children"
  > & {
    stackList: React.ReactNode;
  },
) {
  usePerformanceMonitor({
    Component: TabletopContent.name,
  });

  const size = useRequiredContainerSize();

  return (
    <StackProvider
      availableHeight={size.height}
      availableWidth={size.width}
      sizePreset={defaultCardSizePreset}
    >
      {props.stackList}
    </StackProvider>
  );
}

export function TabletopSkeleton(props: Pick<TabletopProps, "style">) {
  return (
    <TabletopContent
      stackList={<StackListSkeleton style={styles.stackList} />}
    />
  );
}

export default React.memo(function Tabletop({
  deckId,
}: TabletopProps): React.ReactNode {
  usePerformanceMonitor({
    Component: Tabletop.name,
  });

  const stackListRef = React.useRef<StackListRef>(null);
  const tabletopId = useRequiredAppSelector(
    (state) => selectDeck(state, { deckId })?.defaultTabletopId,
    selectDeck.name,
  );
  useSetStackListRef(tabletopId, stackListRef);
  useEnsureTabletop({ tabletopId });
  const dispatch = useAppDispatch();
  const tabletopNeedsResetting = useAppSelector((state) =>
    selectTabletopNeedsResetting(state, { tabletopId }),
  );

  const hasTriedToAutoReset = React.useRef(false);

  React.useEffect(() => {
    if (!tabletopNeedsResetting) return;
    // To prevent any bugs causing some infinite loops or something
    // Our stacks also say if it needs resetting, so it's an okay fallback
    if (hasTriedToAutoReset.current) return;

    dispatch(resetTabletopHelper({ tabletopId }));

    hasTriedToAutoReset.current = true;
  }, [tabletopNeedsResetting, dispatch, tabletopId]);

  const target = React.useMemo(
    (): Target => ({ id: deckId, type: "deck-defaults" }),
    [deckId],
  );

  return (
    <TabletopProvider tabletopId={tabletopId} deckId={deckId} target={target}>
      <TabletopContent
        stackList={<StackList ref={stackListRef} style={styles.stackList} />}
      />
    </TabletopProvider>
  );
});

const styles = StyleSheet.create({
  stackList: {
    zIndex: 3,
    position: "relative",
  },
  background: {
    position: "absolute",
    zIndex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  alertContainer: {
    position: "absolute",
    top: 10,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 4,
  },
  action: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
});
