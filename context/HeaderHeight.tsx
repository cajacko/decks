import React from "react";
import { View, StyleSheet, ViewProps } from "react-native";

let headerHeight = 0;
type Listener = (height: number) => void;
const listeners = new Set<Listener>();

function setHeaderHeight(height: number) {
  headerHeight = height;

  listeners.forEach((listener) => listener(height));
}

const onLayout: Required<ViewProps>["onLayout"] = (event) => {
  setHeaderHeight(event.nativeEvent.layout.height);
};

export function Header() {
  return <View onLayout={onLayout} style={styles.header}></View>;
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
  headerHeight: {
    width: "100%",
  },
});

export function HeaderHeight() {
  const height = useHeaderHeight();

  const style = React.useMemo(
    () => [styles.headerHeight, { height }],
    [height],
  );

  return <View style={style} />;
}

export function useHeaderHeight() {
  const [height, setHeight] = React.useState(headerHeight);

  React.useEffect(() => {
    listeners.add(setHeight);

    return () => {
      listeners.delete(setHeight);
    };
  }, []);

  return height;
}
