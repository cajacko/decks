import React from "react";
import { StyleProp, ViewStyle, View, StyleSheet } from "react-native";
import withDebugLog from "@/utils/withDebugLog";
import { usePerformanceMonitor } from "@/context/PerformanceMonitor";
import { useControlGlobalLoading } from "@/context/GlobalLoading";

const debugLog = withDebugLog(() => false, "Preload");

/**
 * How long to show the loader before starting to render the children
 */
const renderChildrenTimeout = 0;
/**
 * How long to keep showing the loader after the children have been mounted
 */
const showChildrenTimeout = 0;

export interface PreloadProps {
  /**
   * "keep-children-mounted" - Always has the children mounted, and just shows/hides them. We ignore
   * the loader in this case. If you need a loader include it in the children
   *
   * "optimise-mount-unmount-with-loader" - Always has the loader mounted and ensures that is
   * visible to the user before we then mount the children (hidden) and then show them when ready.
   * Also shows the loader on children change (before rendering the new children)
   *
   * "no-preload" - No preload, just usual rendering. Ignores the loader prop
   */
  behaviour:
    | "keep-children-mounted"
    | "optimise-mount-unmount-with-loader"
    | "no-preload";
  /**
   * You want to ensure this style will have the exact dimensions the children will be shown in,
   * even when hidden
   */
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  loader?: React.ReactNode;
  visible?: boolean;
  renderKey: string;
  onPreloaded?: (
    props: Pick<PreloadProps, "behaviour" | "visible" | "renderKey">,
  ) => void;
}

/**
 * We have some routes which take a while to mount/ unmount. So we want to show a skeleton whilst
 * that's happening and have those routes mounted in the background but hidden, so we can quickly
 * show them again. Those routes may also switch the deck ID they target and that switch also takes
 * a while. So in these cases where the children change we want to show the skeleton, ensure the
 * view is showing and then switch the children over.
 */
const OptimisedPreloader = React.memo(function OptimisedPreloader(
  props: Omit<PreloadProps, "behaviour"> & {
    hiddenStyle: StyleProp<ViewStyle>;
  },
) {
  const {
    children: currentChildren,
    loader,
    style,
    visible,
    hiddenStyle,
    renderKey,
  } = props;
  const propsRef = React.useRef(props);
  propsRef.current = props;

  const renderKeyRef = React.useRef(renderKey);
  renderKeyRef.current = renderKey;

  const { startTime, endTime, trackTime } = usePerformanceMonitor({
    Component: OptimisedPreloader.name,
    tags: [renderKeyRef.current],
  });

  // So we can access children in effects without triggering those effects
  const currentChildrenRef = React.useRef(currentChildren);
  currentChildrenRef.current = currentChildren;

  const hasCurrentChildren = !!currentChildren;

  const [rendering, setRendering] = React.useState<
    [React.ReactNode, string] | null
  >(null);
  let [renderChildren, renderChildrenKey] = rendering ?? [null, null];

  const [visibleComponent, setVisibleComponent] = React.useState<
    "loader" | "children"
  >("loader");

  // We need to check for hasCurrentChildren so we don't show old children as we're managing
  // unmounting
  const childrenVisible =
    visible &&
    hasCurrentChildren &&
    visibleComponent === "children" &&
    renderChildrenKey === renderKeyRef.current;

  // Always show the loader when visible and the children aren't visible
  const loaderVisible = visible && !childrenVisible;

  // 1. Whenever the renderKey changes, show the loader (is also our init state)
  React.useEffect(() => {
    startTime(renderKeyRef.current, {
      note: "Preload 1 - renderKey changed",
    });

    debugLog(
      "1. current children changed, showing loader",
      renderKeyRef.current,
    );

    setVisibleComponent("loader");
  }, [renderKey, startTime]);

  // 2. When we have current children and we are showing the loader, mount those current children
  // after a timeout so the views have a chance to render fully and be active
  React.useEffect(() => {
    if (!hasCurrentChildren) return;
    if (visibleComponent === "children") return;

    trackTime({
      note: "Preload 2 - current children are available, showing them after timeout",
    });

    debugLog(
      "2. current children are available, showing them after timeout",
      renderKeyRef.current,
    );

    const timeout = setTimeout(() => {
      trackTime({
        note: "Preload 2 - timeout completed",
      });
      debugLog("2. timeout completed", renderKeyRef.current);
      setRendering([currentChildrenRef.current, renderKeyRef.current]);
    }, renderChildrenTimeout);

    return () => {
      clearTimeout(timeout);
    };
  }, [hasCurrentChildren, visibleComponent, trackTime]);

  // 3. When the renderChildren change wait a bit for them to mount and then show them
  React.useEffect(() => {
    if (!renderChildren) return;

    trackTime({
      note: "Preload 3 - render children changed, showing them after timeout",
    });

    debugLog(
      "3. render children changed, showing them after timeout",
      renderKeyRef.current,
    );

    const timeout = setTimeout(() => {
      debugLog("3. timeout completed", renderKeyRef.current);
      setVisibleComponent("children");

      endTime(renderKeyRef.current, {
        note: "Preload 3 - timeout completed",
      });

      propsRef.current.onPreloaded?.({
        behaviour: "optimise-mount-unmount-with-loader",
        visible: propsRef.current.visible,
        renderKey: propsRef.current.renderKey,
      });
    }, showChildrenTimeout);

    return () => {
      clearTimeout(timeout);
    };
  }, [renderChildren, trackTime, endTime]);

  return (
    <>
      <View style={childrenVisible ? style : hiddenStyle}>
        {renderChildren}
      </View>
      <View style={loaderVisible ? style : hiddenStyle}>{loader}</View>
    </>
  );
});

export default React.memo(function Preload(
  props: PreloadProps,
): React.ReactNode {
  const { behaviour, ...optimisedProps } = props;
  const { children, style, visible, renderKey } = optimisedProps;
  const propsRef = React.useRef(props);
  propsRef.current = props;
  const [loadedRenderKey, setLoadedRenderKey] = React.useState<string | null>(
    null,
  );
  const loading = !loadedRenderKey || loadedRenderKey !== renderKey;

  useControlGlobalLoading("toolbar", renderKey, visible ? loading : false);

  const hiddenStyle = React.useMemo(
    () => StyleSheet.flatten([styles.hidden, style]),
    [style],
  );

  const onPreloaded = React.useCallback<
    NonNullable<PreloadProps["onPreloaded"]>
  >((params) => {
    setLoadedRenderKey(params.renderKey);

    propsRef.current.onPreloaded?.(params);
  }, []);

  React.useEffect(() => {
    if (propsRef.current.behaviour === "optimise-mount-unmount-with-loader") {
      return;
    }

    onPreloaded({
      behaviour: propsRef.current.behaviour,
      visible: propsRef.current.visible,
      renderKey: propsRef.current.renderKey,
    });
  }, [onPreloaded]);

  if (behaviour === "no-preload") {
    if (!visible) {
      return null;
    }

    return <View style={style}>{children}</View>;
  }

  if (behaviour === "keep-children-mounted") {
    return <View style={visible ? style : hiddenStyle}>{children}</View>;
  }

  return (
    <OptimisedPreloader
      hiddenStyle={hiddenStyle}
      {...optimisedProps}
      onPreloaded={onPreloaded}
    />
  );
});

const styles = StyleSheet.create({
  hidden: {
    transform: [{ translateX: 9999999999 }],
  },
});
