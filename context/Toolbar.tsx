import React from "react";
import { StyleSheet, View, StyleProp, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  SharedValue,
  withTiming,
} from "react-native-reanimated";
import useFlag from "@/hooks/useFlag";
import withScreenControlContext, {
  ContextState as CreateContextState,
} from "@/context/withScreenControlContext";
import UIToolbar, {
  ToolbarProps as UIToolbarProps,
  useToolbarHeight,
  iconSize,
  styles,
  _contentHeight,
} from "@/components/ui/Toolbar";

export { iconSize, styles, _contentHeight };

interface ToolbarProps extends UIToolbarProps {
  hidden?: boolean;
}

type ContextState = CreateContextState<ToolbarProps> & {
  sharedToolbarHeight: SharedValue<number> | null;
};

// We want this for our memo keys later
const defaultProps: { [K in keyof ToolbarProps]: ToolbarProps[K] } = {
  hidden: false,
  title: null,
  logoVisible: true,
  children: null,
  back: false,
  loading: false,
};

const { Context, useScreenControlContext, useScreenControlProvider } =
  withScreenControlContext<ToolbarProps, ContextState>(
    {
      onPropsChange: () => undefined,
      onUnmount: () => undefined,
      sharedToolbarHeight: null,
      props: defaultProps,
    },
    defaultProps,
    {
      resetOnUnmount: false,
    },
  );

const orderedKeys = Object.keys(defaultProps).sort() as (keyof ToolbarProps)[];

export function Toolbar({
  style: styleProp,
  ...props
}: ToolbarProps & {
  style?: StyleProp<ViewStyle>;
}) {
  const mergedProps = {
    ...defaultProps,
    ...props,
  };

  const { sharedToolbarHeight } = useScreenControlContext(
    React.useMemo(
      () => mergedProps,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      orderedKeys.map((key) => mergedProps[key]),
    ),
  );

  const { animatedHeightStyle } = useToolbarHeight(sharedToolbarHeight);

  const style = React.useMemo(
    () => [animatedHeightStyle, styleProp],
    [animatedHeightStyle, styleProp],
  );

  return <Animated.View style={style} />;
}

const animateHeightDuration = 500;

export function ToolbarProvider(props: { children: React.ReactNode }) {
  const { height } = useToolbarHeight(null);
  const sharedToolbarHeight = useSharedValue(height);
  const shouldAnimateHeight = useFlag("TOOLBAR_HEIGHT_ANIMATION") === "enabled";

  const {
    onPropsChange,
    onUnmount,
    props: toolbarProps,
  } = useScreenControlProvider();

  // Happens when insets change e.g. on device rotation etc
  React.useEffect(() => {
    if (shouldAnimateHeight) {
      sharedToolbarHeight.value = withTiming(height, {
        duration: animateHeightDuration,
      });
    } else {
      sharedToolbarHeight.value = height;
    }
  }, [sharedToolbarHeight, height, shouldAnimateHeight]);

  const value = React.useMemo(
    (): ContextState => ({
      props: toolbarProps,
      onPropsChange,
      onUnmount,
      sharedToolbarHeight,
    }),
    [sharedToolbarHeight, onPropsChange, onUnmount, toolbarProps],
  );

  React.useEffect(() => {
    if (shouldAnimateHeight) {
      if (toolbarProps.hidden) {
        sharedToolbarHeight.value = withTiming(0, {
          duration: animateHeightDuration,
        });
      } else {
        sharedToolbarHeight.value = withTiming(height, {
          duration: animateHeightDuration,
        });
      }
    } else {
      sharedToolbarHeight.value = height;
    }
  }, [toolbarProps, height, sharedToolbarHeight, shouldAnimateHeight]);

  return (
    <Context.Provider value={value}>
      <UIToolbar sharedToolbarHeight={sharedToolbarHeight} {...toolbarProps} />
      <View style={contextStyles.children}>{props.children}</View>
    </Context.Provider>
  );
}

const contextStyles = StyleSheet.create({
  children: {
    flex: 1,
    position: "relative",
    zIndex: 1,
  },
});
