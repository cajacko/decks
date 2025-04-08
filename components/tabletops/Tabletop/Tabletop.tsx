import React from "react";
import { Dimensions, ScrollViewProps, StyleSheet, View } from "react-native";
import TabletopToolbar from "@/components/tabletops/TabletopToolbar";
import { TabletopProps } from "@/components/tabletops/Tabletop/Tabletop.types";
import StackList, {
  StackListRef,
  StackListSkeleton,
} from "@/components/stacks/StackList";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import useDeckLastScreen from "@/hooks/useDeckLastScreen";
import useEnsureTabletop from "@/hooks/useEnsureTabletop";
import useFlag from "@/hooks/useFlag";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { selectTabletopNeedsResetting } from "@/store/combinedSelectors/tabletops";
import { resetTabletopHelper } from "@/store/actionHelpers/tabletop";
import { TabletopProvider } from "./Tabletop.context";
import { Target } from "@/utils/cardTarget";
import { DrawerChildren } from "@/context/Drawer";
import SettingsTabletop from "@/components/settings/SettingsTabletop";
import SettingsDeck from "@/components/settings/SettingsDeck";
import TabletopNotification, {
  useTabletopNotification,
} from "../TabletopNotification";

function TabletopContent(
  props: Pick<TabletopProps, "style"> & {
    children: React.ReactNode;
    stackListRef: React.RefObject<StackListRef> | null;
    tabletopId: string;
    deckId: string;
    target: Target;
    beforeUndo?: () => void;
    beforeRedo?: () => void;
    loading: boolean;
  },
) {
  const { style } = props;

  const performanceMode = useFlag("PERFORMANCE_MODE") === "enabled";

  const [size, setSize] = React.useState<{ height: number; width: number }>(
    Dimensions.get("screen"),
  );

  // Prevents janky layout reorganising when we get the initial layout
  const opacity = useSharedValue(0);
  const hasLayout = React.useRef(false);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const handleLayout = React.useCallback<Required<ScrollViewProps>["onLayout"]>(
    (event) => {
      // Having the fade in here makes doubly sure we're showing the content. We had a bug where it
      // wasn't showing the content, but this fixed it.
      if (performanceMode) {
        opacity.value = 1;
      } else {
        opacity.value = withTiming(1, {
          // We want this really fast as otherwise in native you see lots of see-through bits
          duration: 200,
        });
      }

      // Prevents us updating when the keyboard comes into view, which we don't want. Maybe there's
      // a better solution for this, that then allows window changes as well?
      if (hasLayout.current) {
        // return;
      }

      hasLayout.current = true;

      const { width, height } = event.nativeEvent.layout;

      setSize({ width, height });
    },
    [opacity, performanceMode],
  );

  const contentStyle = React.useMemo(
    () => [styles.content, style, animatedStyle],
    [animatedStyle, style],
  );

  return (
    <TabletopProvider
      availableHeight={size.height}
      availableWidth={size.width}
      tabletopId={props.tabletopId}
      deckId={props.deckId}
      target={props.target}
    >
      <TabletopToolbar
        loading={props.loading}
        tabletopId={props.tabletopId}
        deckId={props.deckId}
        beforeUndo={props.beforeUndo}
        beforeRedo={props.beforeRedo}
      />
      <Animated.View style={contentStyle} onLayout={handleLayout}>
        {props.children}
      </Animated.View>
    </TabletopProvider>
  );
}

export function TabletopSkeleton(props: Pick<TabletopProps, "style">) {
  return (
    <TabletopContent
      {...props}
      stackListRef={null}
      tabletopId=""
      deckId=""
      loading
      target={{
        id: "",
        type: "deck-defaults",
      }}
    >
      <StackListSkeleton style={styles.stackList} />
    </TabletopContent>
  );
}

export default React.memo(function Tabletop({
  tabletopId,
  deckId,
  style,
}: TabletopProps): React.ReactNode {
  const stackListRef = React.useRef<StackListRef>(null);

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

  useDeckLastScreen({
    deckId,
    screen: "play",
  });

  const target = React.useMemo(
    (): Target => ({ id: deckId, type: "deck-defaults" }),
    [deckId],
  );

  const { beforeUndo, beforeRedo, notification } = useTabletopNotification({
    stackListRef,
  });

  return (
    <>
      <DrawerChildren>
        <SettingsTabletop
          tabletopId={tabletopId}
          deckId={deckId}
          beforeUndo={beforeUndo}
          beforeRedo={beforeRedo}
        />
        <SettingsDeck deckId={deckId} />
      </DrawerChildren>
      <TabletopContent
        style={style}
        target={target}
        loading={false}
        stackListRef={stackListRef}
        tabletopId={tabletopId}
        deckId={deckId}
      >
        {notification && (
          <View style={styles.alertContainer}>
            <TabletopNotification {...notification} />
          </View>
        )}
        <StackList ref={stackListRef} style={styles.stackList} />
      </TabletopContent>
    </>
  );
});

const styles = StyleSheet.create({
  content: {
    position: "relative",
    flex: 1,
    zIndex: 2,
  },
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
